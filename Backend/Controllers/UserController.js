const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {UserModel} = require('../Models/UserModel')
require('dotenv').config()

const UserController = express.Router();

UserController.post('/signup', async (req,res) => {

  const {name , email , role, password } = req.body
 
  if(!(name,email,password,role)){
    return res.send({msg:'Please fill all the details'})
  }
  try {
    const EmailinUse = await UserModel.findOne({ email });
  
      if (EmailinUse) {
        return res.send({
          message: "User already exists. Please login!",
        });
      }
    bcrypt.hash(password, 5, async function(err, hash) {
      try {
        const user = await UserModel.create({
          name: name,
          email: email,
          role: role,
          password: hash
        })
        console.log(user)
        res.send('User Created')
      } catch (error) {
        res.send('Something went Wrong')
        console.log(error)
      }
  });
  } catch (error) {
     res.send('Something went worng')
     console.log(error)
  }
});

module.exports = {UserController}