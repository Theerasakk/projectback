const db = require("../db");

const Status = db.model("Status", {
  tableName: "status",
  requireFetch: false,
});

module.exports = Status;