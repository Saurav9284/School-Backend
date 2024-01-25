const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name : {type:String,required:true},
    email : {
        type:String,
        required:true,
        unique:true,
        validate : {
            validator: validator.isEmail,
            message: "Invalid email format",
        },
    },
        password : {type:String,required:true},
        role: {
            type: Array,
            required: true,
          },
});

const UserModel = mongoose.model('Users',userSchema);

module.exports = {UserModel}