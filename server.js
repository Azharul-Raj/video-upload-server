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