const express = require("express");
const app = express.Router();
const LeaveWork = require("./leaveWork");
const multer = require("multer");

const uploads = multer({
  fileFilter: (req, file, cb) => {
    var filecheck = /jpg|peg|gif|png/.test(file.mimetype) //เช็ค type immage
    if(filecheck){
      return cb(null, true) //
    }else {
      console.log('file is not match')
    }
  }
});

app.get("", (req, res) => {
  res.send("api leavework is running");
});

app.post('/upload',[
  uploads.single('file')
], new LeaveWork().uploadfile
)

app.post("/createLeave", new LeaveWork().createLeave);
app.post("/showleave", new LeaveWork().showLeave)
module.exports = app;