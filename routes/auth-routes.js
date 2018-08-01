const express    = require('express');
const passport   = require('passport');
const bcrypt     = require('bcryptjs');

const authRoutes = express.Router(); 
const User       = require('../models/user');// the user model

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;

//making sure the required fields have values 
  if (!username || !password || !email) {
    res.status(400).json({ message: 'Provide username, password and email' });
    return;
  }

//making sure the password is 8 charachters or longer
  if (password.length < 8) {
    res.status(400).json({ message: 'Password has to be at least 8 charachters long' });
    return;
  }

//   if( password !== req.body.checkedPassword){
//     res.status(400).json({ message: 'Passwords do not match!' });
//     return;
//   } else {  
        //making sure the email is unique in DB
        User.findOne({ email }, '_id', (err, foundEmail) => {
                if (foundEmail) {
                res.status(400).json({ message: 'The email already exists in the database' });
                return;
        }

            const salt     = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(password, salt);

            const theUser = new User({
            username,
            password: hashPass,
            email
            });

            theUser.save((err) => {
            if (err) {
                res.status(400).json({ message: 'Something went wrong while saving the account etails' });
                return;
            }

            req.login(theUser, (err) => {
                if (err) {
                res.status(500).json({ message: 'Something went wrong while redirecting to logged in status' });
                return;
                }

                res.status(200).json(req.user);
            });
            });
        });

    // }
});

authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }
  
      if (!theUser) {
        res.status(401).json(failureDetails);
        return;
      }
  
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' });
          return;
        }
  
        // We are now logged in (notice req.user)
        res.status(200).json(req.user);
      });
    })(req, res, next);
  });

authRoutes.post('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Success' });
  });


authRoutes.get('/loggedin', (req, res, next) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
    }
  
    res.status(403).json({ message: 'Unauthorized' });
  });


//handling editing user's profiles
authRoutes.get('/:userId/edit', (req, res, next)=>{
    User.findById(req.params.userId)
    .then((user)=>{
        res.status(200).json(user)
    })
    .catch((err)=>{
        next(err);
    })
 })  

//saving the edited user's profile
authRoutes.post('/:userId/update', (req, res, next)=>{
    const password = req.body.password;
    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const updUser = {
        username:    req.body.username,
        password:    hashPass,
        email:       req.body.email,
        features:    req.body.features
    };

    User.findByIdAndUpdate(req.params.userId, updUser)
    .then((user)=>{
        res.status(200).json(user)
    })
    .catch((err)=>{
        next(err);
    })  
});

//deleting the user's profile
authRoutes.post('/:userId/delete', (req, res, next)=>{
  const id = req.params.userId;
    User.findByIdAndRemove(id)
    .then(() =>{
        res.status(200).json()
    })
    .catch((err) => {
        next(err); 
    })
}); 

module.exports = authRoutes;
