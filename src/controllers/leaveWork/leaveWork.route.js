const express = require("express");
const app = express.Router();
const LeaveWork = require("./leaveWork");
const multer = require("multer");

const uploads = multer({
  fileFilter: (req, file, cb) => {
    var filecheck = /jpg|peg|gif|png|pdf/.test(file.mimetype) //เช็ค type immage
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
app.post("/filter", new LeaveWork().filterData);
// app.post("/showleave", new LeaveWork().showLeave)
app.get("/getstatus", new LeaveWork().showStatus)
app.put("/update/:leave_id", new LeaveWork().updateLeave);
app.delete("/delete/:leave_id", new LeaveWork().deleteLeave);

module.exports = app;