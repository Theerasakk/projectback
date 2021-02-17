const Users = require("./../../models/users");
const Utils = require("./../../utils");


class AuthenController {
  constructor() {}

  async login(req, res) {
    try {
      let input = req.body;
      input.email = input.email || "";

      if (!new Utils().validateEmail(input.email)) {
        throw new Error("Invalid email.");
      }

      if (!input.password) {
        throw new Error("Require password.");
      }

      let password = new Utils().encryptPassword(input.password);

      // check
      let user = await Users.where("email", input.email)
        .where("password", password)
        .fetch();
      if (!user) {
        throw new Error("Invalid email/password.");
      }
      user = user.toJSON();
     
    
      let token = new Utils().signToken({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      });
      res.status(200).json({
        type: "Bearer",
        token: token,
      });
      console.log(token)

    
      console.log(user);
      console.log(user.role);
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({
        message: err.message,
      });
    }
  }
}

module.exports = AuthenController;
