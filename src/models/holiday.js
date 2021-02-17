const db = require("../db");

const Holiday = db.model("Holiday", {
  tableName: "holiday",
  requireFetch: false,
});

module.exports = Holiday;