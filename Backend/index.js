const express = require('express')
require('dotenv').config()
const {connection} = require('./Configs/db')
const {UserController} = require('./Controllers/UserController')
const {TeacherController} = require('./Controllers/TeacherController')
const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/',(req,res)=>{
   res.send('API running')
})

app.use('/user',UserController)
app.use('/teacher',TeacherController)

app.listen(PORT, async ()=> {
   try {
      await connection
      console.log('Connected to MongoDB')
   } catch (error) {
      console.log('Error while connecting to MongoDB')
   }
   console.log(`Listening on PORT :${PORT}`)
})