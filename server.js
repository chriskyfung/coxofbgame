// server.js
// where your node app starts

// init project
const path = require("path");
const fs = require("fs");
const filename = '/upload/data.json';


const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
app.get("/", express.static(path.join(__dirname, "./public")));

const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./images/" //"/path/to/temporary/directory/to/store/uploaded/files"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    console.log(req.body);
    console.log(req.file);
    
    if (req['file']){
      const tempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = createFile(path.join(__dirname, "./images/"), req.file.filename, ext);

      const obj = { groupid: req.body.groupid, textcontent: req.body.textcontent, image: targetPath, ts: Date.now() };

      writeTextFile(filename , obj);

      
      if (ext === ".png"|| ext === ".jpg" || ext === ".jpeg") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);

          res
            .status(200)
            .redirect('/results');
            //.sendFile(targetPath);
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);

          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    }else {
       const obj = { groupid: req.body.groupid, textcontent: req.body.textcontent, ts: Date.now() };

       writeTextFile(filename , obj);
        res
              .status(200)
              .redirect('/results');
    }
  }
);

function createFile(fpath, fname, ext){
  var targetPath = fpath + fname + ext;
  var i = 1;
  while (fs.existsSync(targetPath)) {
    targetPath = fpath + fname + i + ext;
    i++;
  };
  return targetPath;
};

function writeTextFile(fname, obj) {
  
  const fpath = path.join(__dirname, fname)
  fs.readFile(fpath, function (err, data) {
    if (data.toString() == '') {
      var json = [];
    } else {
      var json = JSON.parse(data)
    };
    json.push(obj)
    fs.writeFile(fpath, JSON.stringify(json), function(err, data){
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });    
  })

  /*var record = data;
  fs.writeFile(path.join(__dirname, fname), JSON.stringify(record), function(err, data){
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });*/
};


app.get("/help", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/help.html"));
});

app.get("/results", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/results.html"));
});

app.get("/reset", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/reset.html"));
});

app.get("/images/*", (req, res) => {
  console.log('load images')
  console.log(req.originalUrl)
  res.sendFile(path.join(__dirname, req.originalUrl));
});

function readTextFile(fname) {
  fs.readFile(path.join(__dirname, fname), 'utf-8' ,function(err, buf) {
    console.log(buf.toString());
    return buf.toString();
  });  
};

app.get("/getResults", (req, res) => {
  console.log('getResults')
  //var output = readTextFile('/upload/text.txt');
  
  fs.readFile(path.join(__dirname, filename), 'utf-8' ,function(err, buf) {
    if (buf.length > 0) {
      console.log(buf.toString());
      var data = sortByKey(JSON.parse(buf), 'groupid', 'ts');
      res.send({ success: true , obj: data});
    } else {
      res.send({ success: false});
    };      
  });
  
  //res.send(path.join(__dirname, "./views/results.html"));
});

app.get("/clearresults", (req, res) => {
  console.log('clearresults')
  console.log(req.query);
  if (req.query.password == process.env.SECRET) {
  
      fs.writeFile(path.join(__dirname, filename), '', function(err, data){
          if (err) console.log(err);
          console.log("Successfully Clear to File.");
        });
    
      const directory = 'images';

      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      });
    res.send("Successfully Clear to File.");
  } else {
    res.send("Incorrect Password.");
  };
});

function sortByKey(array, key1, key2) {
    return array.sort(function(a, b) {
        var x1 = a[key1]; var y1 = b[key1];
        var x2 = a[key2]; var y2 = b[key2];
        if(x1 == y1)
        {
            return ((x2 < y2) ? -1 : ((x2 > y2) ? 1 : 0));
        }
        else
        {
            return ((x1 < y1) ? -1 : ((x1 > y1) ? 1 : 0));
        }
    });
}