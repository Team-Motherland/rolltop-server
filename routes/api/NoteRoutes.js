const express       = require('express');
const router        = express.Router();
const Note        = require('../../models/Note');

// Get All Notes (JM) (DONE)
router.get('/notes/getNotes', (req, res, next) => {
  Note.find({}, (err, notes) => {
    if (err) { return res.json(err).status(500); }

    return res.json(notes);
  });
});

// Post New Note (JM) (DONE)
router.post('/notes/postNote', (req, res, next) => {
  Note.create({
    title: req.body.title,
    content: req.body.content
    })
    .then((response)=>{
        res.json(response)
    })
    .catch((err)=>{
        res.json(err);
    })
});

// Get Specific Notes (JM) (DONE)
router.get('/notes/getNote/:id', (req, res, next) => {
  Note.findById(req.params.id, (err, notes) => {
    if (err) { return res.json(err).status(500); }

    return res.json(notes);
  });
});

//Edit Notes (JM) (DONE)
router.post('/notes/editNote/:id', (req, res, next) => {

  const content = req.body.content;
  
  Note.findById(req.params.id)
      .then((note)=>{
          note.content = content;
          note.save()
              .then((response)=>{
                  res.json(response);
              })
      })
  .catch((err)=>{
      res.json(err);
  })  
});

//Delete Notes (JM) (TODO)
router.post('/notes/deleteNote/:id', (req, res, next) => {
 
  Note.findByIdAndRemove(req.params.id)
      .then((response) =>{
          res.json(response);
      })
  .catch((err)=>{
      res.json(err);
  });
});

module.exports = router;
/* Fake comments hahha*/