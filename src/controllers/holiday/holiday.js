const Holiday = require("./../../models/holiday");
const HolidayModel = require("./../../models/holiday");

class HolidayController {
  constructor() {}

  async createHoliday(req, res) {
    try {
      let input = req.body;
      input.date = input.date || "";
      input.content = input.content || "";
      await new HolidayModel({
        date: input.date,
        content: input.content,
      }).save();

      res.status(200).json({
        message: "complete",
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
}

module.exports = HolidayController;