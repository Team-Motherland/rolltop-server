const express    = require('express');
const passport   = require('passport');
const bcrypt     = require('bcryptjs');
const fs         = require('fs'); // (JM): Added Filesystem to add folder when signing up

const authRoutes = express.Router(); 
const User       = require('../../models/user');// the user model

// Login Route (A) (JM TEST: WORKS)
authRoutes.post('/signup', (req, res, next) => {
  console.log('body is:', req.body)
  const username = req.body.signUpUsername;
  const password = req.body.signUpPassword;
  const email    = req.body.signUpEmail;

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

  if( password !== req.body.signUpCheckedPassword){
    res.status(400).json({ message: 'Passwords do not match!' });
    return;
  } else {  
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
            
            //Testing Features
            theUser.features.push(['NTS', []]); //Add Note Features
            theUser.features.push(['PRJ', []]);
            theUser.features.push(['FPL', []]);

            theUser.save((err) => {
            if (err) {
                res.status(400).json({ message: 'Something went wrong while saving the account details' });
                return;
            }
            
            // (JM) : Create Folder for pastebin
            var dir = __dirname + '../../../public/pastebin/' + theUser.id;
            fs.mkdirSync(dir);
            

            req.login(theUser, (err) => {
                if (err) {
                res.status(500).json({ message: 'Something went wrong while redirecting to logged in status' });
                return;
                }

                res.status(200).json(req.user);
            });
            });
        });

    }
});

// Login Route (A) (JM TEST: NOT WORKING)
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
  //console.log('hey: ', req.user)
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
    }
  
    res.status(403).json({ message: 'Unauthorized' });
  });


//handling editing user's profiles
authRoutes.get('/:userId', (req, res, next)=>{
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
    //comparing new password entry from 2 fields    
    if (req.body.password !== req.body.checkedPassword) {
        res.status(400).json({ message: 'Passwords do not match!' }); 
        return;
    } else { 
        
        const password = req.body.password;
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        const updUser  = {
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
  } 
});

//deleting the user's profile
authRoutes.post('/:userId/delete', (req, res, next)=>{
  const id = req.params.userId;
    User.findByIdAndRemove(id)
    .then(() =>{
        res.status(200).json({ message: 'The user account has been deleted' })
        
    })
    .catch((err) => {
        next(err); 
    })
}); 

module.exports = authRoutes;
