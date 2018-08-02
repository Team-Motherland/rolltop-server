const express       = require('express');
const router        = express.Router();
//const Note        = require('../../models/Note');
const testFolder = __dirname + '../../../pastebin/';
const fs            = require('fs');


// Tester for Upload (JM) (DONE)
router.get('/',function(req,res){
    //res.sendFile(__dirname+'../../views/index.html');
    res.render('index');
});

// Uploads File POST (JM) (TODO: Upload to user folder, allow upload if folder is less than 75MB) 
router.post('/upload/:id',function(req,res){
    console.log(req.files);
    if(req.files.upfile){
      var file = req.files.upfile,
        name = file.name, //file.name,
        type = file.mimetype;
      var uploadpath = __dirname + '../../../pastebin/' + req.params.id + "/" + name;
      file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.send("Error Occured!")
        }
        else {
          console.log("File Uploaded",name);
          res.send('Done! Uploading files')
        }
      });
    }
    else {
      res.send("No File selected !");
      res.end();
    };
});

//Downlod route for any file (JM) (TODO: Download specific File) | Uses Query params "?name = UPE.jpg"
router.get('/download/:id', function(req, res){
    var fileName = req.query.name; 
    var file = __dirname + '../../../pastebin/' + fileName;
    res.download(file); // Set disposition and send it.
});

// Returns JSON of all Files in a folder (JM) (TODO: Add user functionality, create folder when user account is created)
router.get('/printfolder/:id',function(req,res){
    fs.readdir(testFolder, (err, files) => {
        // Files Array
        console.log(JSON.stringify(files));
      })
  })


module.exports = router;