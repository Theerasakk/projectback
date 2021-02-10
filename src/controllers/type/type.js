const { knex } = require("../../db");
const TypesModel = require("../../models/types");

class TypesController {
  
  constructor() {}
  
  async search(req, res) {
    try {
      let types_query = TypesModel
      // console.log(typ)
      let type = await types_query.fetchPage({
        columns: ["*"],          //เลือก colum ตาม db ของเราด้วย++++++++++
        // columns:["id"],
        // page: input.page,
        // pageSize: input.per_page,
      });
      // let myJSON = JSON.stringify(types_query);
      type = type.toJSON();
      // console.log(types_query);
      let count = await types_query.count();

      res.status(200).json({
        count: count,
        data: type,
      });
      // console.log(users)
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
}
module.exports = TypesController;