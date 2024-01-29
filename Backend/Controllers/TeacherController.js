
const express = require('express')
const {TeacherModel} = require('../Models/TeacherModel')
const {authorization} = require('../Middlewares/authorization')
const TeacherController = express.Router()


TeacherController.get("/", authorization(["VIEW_ALL", "VIEWER", "CREATER"]), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const roleQuery = req.query.role;

    let query = {};

    // Filtering option
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Sorting logic
    const sortOptions = {};
    if (req.query.sort) {
      // Assuming sort is a query parameter containing the field to sort by
      sortOptions[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }

    // Searching logic for name
    if (req.query.name) {
      // Use a regex for partial matching
      query.name = { $regex: new RegExp(req.query.name, "i") };
    }

    // Search for author (assuming 'createrId' is the field representing the creator's ID)
    if (roleQuery === "CREATER" || roleQuery === "VIEW") {
      query.createrId = req.userId;
    }

    const totalItems = await TeacherModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await TeacherModel.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      data,
      page,
      totalPages,
      totalItems,
    });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});


TeacherController.post('/',authorization(["CREATER"]),async (req,res)=>{
    const userId = req.userId
    const {name,age,department} = req.body
    try {
        if(name,age,department){
            const newTeacher = await TeacherModel.create({ ...req.body, createrId: userId });
            res.send({ message: "Teacher added successfully" });
            console.log(newTeacher)
        }
        else{
            res.send({ message:'Please fill all the details!'})
        }
    } catch (error) {
        res.send({ message:'Something went wrong'})
        console.log(error)
    }
});

TeacherController.patch('/edit/:id',authorization(["CREATER"]),async (req,res)=>{
   try {
    const id = req.params.id;
    const createrId = req.userId;

    const data = await TeacherModel.findOneAndUpdate({ _id: id, createrId },{ ...req.body });
      if(data){
        res.send({ message:'Data Updated Successfully'})
        console.log(data)
      }
      else{
        res.send({ message:"Teachers data not found"});
      }
    
   } catch (error) {
     res.send({ message:'Something went wrong'})
     console.log(error)
   }
});


TeacherController.delete('/delete/:id',authorization(["CREATER"]),async (req,res)=>{
    try {
        const id = req.params.id;
        const createrId = req.userId;

        const data = await TeacherModel.findOneAndDelete({ _id: id, createrId });

        if (data) {
            res.send({ message:'Data Deleted Successfully'})
          } else {
            res.send({ message:"Teachers data not found"});
          }
    } catch (error) {
        res.send({ message:'Something went wrong'})
        console.log(error)
    }
});


module.exports = {TeacherController}

