const express       = require('express');
const router        = express.Router();
//const Note        = require('../../models/Note');
const testFolder = __dirname + '../../../public/pastebin/';
const fs            = require('fs');


// Tester for Upload (JM) (DONE)
router.get('/',function(req,res){
    //res.sendFile(__dirname+'../../views/index.html');
    res.render('index');
});

// Uploads File POST (JM) (TODO: Upload to user folder, allow upload if folder is less than 75MB) 
router.post('/upload',function(req,res){

	console.log("Upload Called");
  if(req.user === undefined){
	console.log("Not logged in");
    return res.json("Not logged in");
  }
	
    console.log("This is log for upload ",req.files);
    if(req.files.upload){
      var file = req.files.upload,
        name = file.name, //file.name,
        type = file.mimetype;
      var uploadpath = __dirname + '../../../public/pastebin/' + req.user.id + "/" + name;
      file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.json("Error Occured!")
        }
        else {
          console.log("File Uploaded",name);
          res.json('Done! Uploading files')
        }
      });
    }
    else {
      res.send("No File selected !");
      res.end();
    };
});

//Downlod route for any file (JM) (TODO: Download specific File) | Uses Query params "?name = UPE.jpg"
router.get('/download/:name', function(req, res){

  if(req.user === undefined){
    return res.json("Not logged in");
  }

    var fileName = req.params.name; 
    var file = __dirname + '../../../public/pastebin/' + req.user.id + "/" + fileName;
    res.download(file); // Set disposition and send it.
});

// Returns JSON of all Files in a folder (JM) (TODO: Add user functionality, create folder when user account is created)
router.get('/printFolder', function(req,res){

  if(req.user === undefined){
    return res.json("Not logged in");
	}

    fs.readdir(testFolder + '/' + req.user.id, (err, files) => {
        // Files Array
        console.log(JSON.stringify(files));
		res.json(files);
      })
})


module.exports = router;