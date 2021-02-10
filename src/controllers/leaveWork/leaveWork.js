const { knex } = require("../../db");
const Leavework = require("./../../models/leave_work");
const Utils = require("./../../utils");
const fs = require('fs');
var admin = require("firebase-admin");


class LeaveworkController {
  constructor() {}


  async createLeave(req, res) {
    try {
      let input = req.body;
      input.id_user_fk = input.id_user_fk || "";
      input.id_status_fk = input.id_status_fk || "";
      input.id_type_fk = input.id_type_fk || "";
      input.date_start = input.date_start || "";
      input.date_end = input.date_end || "";
      input.description = input.description || "";
      input.file = input.file || "";
      // await new Leavework({
      //   id_users: input.id_users,
      //   date_time: input.date_time,
      //   type_leave: input.type_leave,
      // }).save();
      // await knex("leavework").insert({
      //   date_time: input.date_time,
      //   type_leave: input.type_leave,
      //   id_users: input.id_users,
      // });
      await new LeaveworkModel({
        id_user_fk: input.id_user_fk,
        id_status_fk: input.id_status_fk,
        id_type_fk: input.id_type_fk,
        date_start: input.date_start,
        date_end: input.date_end,
        description: input.description,
        file: input.file,
      }).save();

      // .from("user")
      // .innerJoin("leavework", "users.id", "leavework.id_users");
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

  async showLeave(req, res) {
    try {
      let input = req.body;
      input.search = input.search || "";
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;

      let leave_query = Leavework.query((qb) => {
        if (input.search) {
          qb.where("id", "LIKE", `%${input.search}%`);
          qb.orWhere("description", "LIKE", `%${input.search}%`);
          qb.orWhere("email", "LIKE", `%${input.search}%`);
        }
        qb.orderBy("id", "DESC");
      });
      // console.log(types_query);
      let types = await leave_query.fetchPage({
        columns: ['*'],
        page: input.page,
        pageSize: input.per_page,
      });

      types = leave_query.toJSON();
      // let count = await leave_query.count();

      res.status(200).json({
        // count: count,
        data: types,
      });
      // console.log(users)
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async uploadfile (req, res){
    try{
      let image = req.file.buffer //ฝั่ง client ส่ง file มา
      let filename = `${Date.now()}-${req.file.originalname}`
      let save_patch = `${process.cwd()}/public/temp/${filename}`

      fs.writeFileSync(`${process.cwd()}/public/temp/${filename}`, image) // เขียน file in folder temp
      
      let upload = admin.storage().bucket()

      let res_upload = await upload.upload(save_patch,{ // up to firebase

      })
      fs.unlinkSync(save_patch) // delete from temp
      
      
      let getpath = await res_upload[0].getMetadata()
      getpath = getpath[0]
      let url = `https://firebasestorage.googleapis.com/v0/b/${getpath.bucket}/o/${getpath.name}?alt=media`
      return res.json({
        patch: url
        
      })

    }catch (err) {
      console.log(err.stack)
      res.status(400).json({
        message: err.message
      })
    }
    console.log("Upload success")
  }
}
module.exports = LeaveworkController;