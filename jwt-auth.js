const jwt = require("jsonwebtoken");
const secret = "sikretongmalupet";

/*This will create a token for a user*/
module.exports.createToken = (user) => {
  let data = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(data, secret, { expiresIn: "2h" });
};
