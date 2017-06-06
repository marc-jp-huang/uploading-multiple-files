//run "node app.js" in command line and got to http://localhost:3000/
//to handle the routes and serve up the HTML, CSS, and JS files
var express = require('express');
var app = express();

//provides utilities for working with file and directory paths (core)
var path = require('path');

//to parse the incoming form data containing the file uploads
var formidable = require('formidable');

//File System module https://nodejs.org/api/fs.html (core)
var fs = require('fs');

//provide static files, for more http://expressjs.com/zh-tw/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));

//set index page
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

//an action uri for handling uploaded files
app.post('/upload', function(req, res){

  // create an incoming form object https://www.npmjs.com/package/formidable
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

//host port
var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
