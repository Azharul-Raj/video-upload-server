const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv").config();
const fs = require("fs");

const server = express();
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log("server is up and running");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const upload=multer({storage})
//video posting route
server.post("/upload",upload.single("videoFile"),(req,res)=>{
    try {
        res.send("File uploaded successfully")
    } catch (error) {
        console.log(error);
    }
});
