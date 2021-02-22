const Users = require("./../../models/users");
const Utils = require("./../../utils");

class UsersController {
  constructor() { }

  async search(req, res) {
    try {
      let input = req.body;
      input.search = input.search || "";
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;

      let users_query = Users.query((qb) => {
        if (input.search) {
          qb.where("first_name", "LIKE", `%${input.search}%`);
          qb.orWhere("last_name", "LIKE", `%${input.search}%`);
          qb.orWhere("email", "LIKE", `%${input.search}%`);
        }
        qb.orderBy("id", "DESC");
      });
      // console.log("this is log",users_query)
      let users = await users_query.fetchPage({
        columns: ["*"], //เลือก colum ตาม db ของเราด้วย++++++++++
        page: input.page,
        pageSize: input.per_page,
      });
      // console.log("this is a type:",typeof users_query)
      users = users.toJSON();
      let count = await users_query.count();

      res.status(200).json({
        count: count,
        data: users,
      });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

 

  async createUser(req, res) {
    try {
      let input = req.body;
      input.email = input.email || "";
      input.password = input.password || "";
      input.first_name = input.first_name || "";
      input.last_name = input.last_name || "";
      input.role = input.role || "";
      input.position = input.position || "";

      // if (!new Utils().validateEmail(input.email)) {
      //   throw new Error("Invalid email.");
      // }

      if (!input.first_name) {
        throw new Error("Require first name.");
      }
      
      if (!input.last_name) {
        throw new Error("Require last name.");
      }

      if (!input.password) {
        throw new Error("Require password.");
      }

      let password = new Utils().encryptPassword(input.password);

      // check
      let user = await Users.where("email", input.email).fetch();
      if (user) {
        throw new Error("มีผู้ใช้งานนี้แล้ว.");
      }

      await new Users({
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        password: password,
        role: input.role,
        position: input.position
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
  async showDB(req, res) {
    try {
      let authen = req.authen;
      let authen_id = req.authen.id;
      // console.log(authen);
      if (authen) {
        let users_query = Users.query((qb) => {
          qb.from("leavework")
            .innerJoin("users", "users.id", "leavework.id_user_fk")
            .innerJoin("status", "status.id", "leavework.id_status_fk");
          qb.where("users.id", "=", authen_id);
        });
        // console.log(typeof users_query)
        let users = await users_query.fetchPage({
          columns: [
            "leavework.id",
            "description",
            "created_at",
            "first_name",
            "last_name",
            "email",
            "date_start",
            "date_end",
            "type",
            "status_name",
            "file",
            "allday"
          ],
          //เลือก colum ตาม db ของเราด้วย++++++++++
          // columns:["leavework.created_at"]
          // page: in, put.page,
          // pageSize: input.per_page,
        });
        // console.log(users)
        users = users.toJSON();
        // console.log(users);
        let count = await users_query.count();

        res.status(200).json({
          count: count,
          data: users,
        });
        console.log(users);
      }
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async showAllUser(req, res) {
    try {
      let input = req.query;
      // let authen = req.authen;
      let authen_role = req.authen.role;
      input.page = input.page || 1;
      input.per_page = input.per_page || 10;
      if (authen_role === "admin") {
        let users_query = Users.query((qb) => {
          qb.from("leavework")
            .innerJoin("users", "users.id", "leavework.id_user_fk")
            .innerJoin("status", "status.id", "leavework.id_status_fk");
          qb.where("users.role", "!=", authen_role);
        });
        let users = await users_query.fetchPage({
          columns: [
            "leavework.id",
            "description",
            "created_at",
            "first_name",
            "last_name",
            "email",
            "date_start",
            "date_end",
            "type",
            "status_name",
            "id_status_fk",
            "role",
            "file",
            "allday"

            //update
          ],
          pageSize: input.per_page, // Defaults to 10 if not specified
          page: input.page, // Defaults to 1 if not specified
        });
        users = users.toJSON();
        let count = await users_query.count();

        res.status(200).json({
          count: count,
          data: users,
        });
        console.log(users);
      }
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      let input = req.body;
      let authen = req.authen;
      // console.log(authen.id, req.params.user_id)
      let user_id = req.params.user_id;
      if (authen.id != user_id) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }

      input.name = input.name || "";
      if (!input.name) {
        throw new Error("Require name.");
      }

      // check
      let user = await Users.where("id", user_id).fetch();
      if (!user) {
        throw new Error("ไม่มีผู้ใช้งานนี้.");
      }

      await user.save(
        {
          name: input.name,
        },
        { methods: "update", patch: true }
      );

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

  async deleteUser(req, res) {
    try {
      let authen = req.authen;
      let user_id = req.params.user_id;
      if (authen.id != user_id) {
        throw new Error("ไม่มีสิทธิ์เข้าถึง.");
      }
      // check
      let user = await Users.where("id", user_id).fetch();
      if (!user) {
        throw new Error("ไม่มีผู้ใช้งานนี้.");
      }

      await user.destroy({ require: false });

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

module.exports = UsersController;