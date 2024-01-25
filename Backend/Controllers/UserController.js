const express = require('express')
const {UserModel} = require('../Models/UserModel')
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const userController = express.Router()

userController.post("/signup", async (req, res) => {
    const { email, name, password, role } = req.body;
    if (!(email && password && name && role)) {
      return res.send({ message: "Please fill all the details" });
    }
  
    try {
      const userExist = await UserModel.findOne({ email });
  
      if (userExist) {
        return res.send({
          message: "User already exists. Please login!",
        });
      }
  
      bcrypt.hash(password, 5, async function (err, hash) {
        if (err) {
          return res.send({ message: "Something went wrong" });
        }
        try {
          const user = await UserModel.create({
            ...req.body,
            role: role,
            password: hash,
          });
          res.send({ message: "User signed up successfully" });
        } catch (error) {
          if (error.name === "ValidationError") {
            res.send({ error: error.message });
          } else {
            res.send({ error: "Server Error" });
          }
        }
      });
    } catch (error) {
      res.send({ message: "Server Error" });
    }
  });


userController.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!(email && password)) {
      return res.send({ message: "Please fill all the details" });
    }
  
    try {
      const userExist = await UserModel.findOne({ email });
  
      if (!userExist) {
        return res.send({
          message: "User does not exist. Please Signup!",
        });
      }
  
      bcrypt.compare(password, userExist.password, function (err, result) {
        if (result) {
          const token = jwt.sign({ role: userExist.role, userId: userExist._id },process.env.JWT_SECRET);
          return res.json({
            message: "login succcessful",
            userData: {
              token: token,
              name: userExist.name,
              role: userExist.role,
            },
          });
        } else {
          return res.send({message: "Wrong credentials!",});
        }
      });
    } catch (error) {
      res.send({ message: "Internal Server Error" });
    }
  });

  module.exports = { userController };