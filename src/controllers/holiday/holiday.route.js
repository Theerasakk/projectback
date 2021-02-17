const express = require("express");
const app = express.Router();
const Holiday = require("./holiday");
app.get("", (req, res) => {
  res.send("api holiday run");
});

app.post("/createholiday", new Holiday().createHoliday);
module.exports = app;