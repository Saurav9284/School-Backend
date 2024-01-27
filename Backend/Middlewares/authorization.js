require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorization = (arr) => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.send({ msg: "Please login first" });
    }
    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.send({ msg: "Please login first" });
      }
        const role = decoded.role;
        req.userId = decoded.userId;
        req.role = decoded.role[0];
        return next();
    });
  };
};

module.exports = { authorization };