const Holiday = require("./../../models/holiday");
const HolidayModel = require("./../../models/holiday");

class HolidayController {
  constructor() {}

  async createHoliday(req, res) {
    try {
      let input = req.body;
      input.date = input.date || "";
      input.content = input.content || "";
      input.type = input.type || "";

     if(!input.content){
       throw new Error('กุณาใส่รายละเอียดของวันหยุด')
     }

     else if (!input.type){
       throw new Error('กรุณาใส่รูปแบบของวันหยุด')

     } else {
      await new HolidayModel({
        date: input.date,
        content: input.content,
        type: input.type,
      }).save();

      res.status(200).json({
        message: "complete",
      });
     }

     
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async getHoliday(req, res) {
    try {
      let holiday_q = HolidayModel;
      let holiday = await holiday_q.fetchPage({
        column:['*'],
        pageSize: 100
      });

      holiday = holiday.toJSON();
      let count = await holiday_q.count();
      res.status(200).json({
        data: holiday,
        count: count,
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