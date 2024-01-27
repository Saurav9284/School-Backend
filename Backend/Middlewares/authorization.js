require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorization = (arr) => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.send({ message: "Please login first" });
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.send({ message: "Please login first" });
      }

      const role = decoded.role;

      const commonElements = arr.filter((ele) => role.includes(ele));
      if (commonElements.length > 0) {
        req.userId = decoded.userId;
        req.role = decoded.role[0];
        return next();
      }

      return res.send({ message: "Not Authorized" });
    });
  };
};

module.exports = { authorization };