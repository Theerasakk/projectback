const db = require("./../db");

const LeaveWork = db.model("LeaveWork", {
  tableName: "leavework",
  hasTimestamps: true, // มันจะ add เวลา auto ลง column  created_at และ updated_at เวลามีข้อมูล update ใน row
  requireFetch: false,
});

module.exports = LeaveWork;
