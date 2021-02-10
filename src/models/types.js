const db = require("./../db");

const Types = db.model("Types", {
  tableName: "types",
//   hasTimestamps: true, // มันจะ add เวลา auto ลง column  created_at และ updated_at เวลามีข้อมูล update ใน row
  requireFetch: false,
});

module.exports = Types;