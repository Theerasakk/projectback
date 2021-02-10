const express = require("express");
const app = express.Router();
const Types = require("./type");

app.get("", (req, res) => {
  res.send("API type running.");
});

app.get("/search", new Types().search);

module.exports = app;