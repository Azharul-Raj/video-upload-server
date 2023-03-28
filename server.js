const express = require("express");
const multer = require("multer");
require("dotenv").config();
const fs = require("fs");

const server = express();
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log("server is up and running");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/videos");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname );
  },
});

const upload=multer({storage})

//video posting route
/*************************************************************
 * MAKE SURE YOU WRITE THE EXACT NAME IN THE FORM FIELD. 
 * In our case the field name is "video"
 **************************************************************/
server.post("/upload",upload.single("video"),(req,res)=>{
    try {
        res.send("File uploaded successfully")
    } catch (error) {
        console.log(error);
    }
});
// video stream route
server.get('/stream/:filename', (req, res) => {
  try{
  const path = __dirname + '/upload/videos/' + req.params.filename;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}
catch(err){
  console.log(err);
}
});

// video downloading route
server.get("/download/:filename",(req,res)=>{
  try {
    const file=__dirname+"/upload/videos/"+req.params.filename;
    if(!file){
      return res.send(`${req.params.filename} is not available.`)
    }
    res.download(file);
    
  } catch (error) {
    console.log(error);
  }
})