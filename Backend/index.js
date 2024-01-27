const express = require('express')
require('dotenv').config()
const {connection} = require('./Configs/db')
const {UserController} = require('./Controllers/UserController')
const {authorization} = require('./Middlewares/authorization')
const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('API running')
})

app.use('/user',UserController)

app.use(authorization)




app.listen(PORT, async ()=> {
   try {
      await connection
      console.log('Connected to MongoDB')
   } catch (error) {
      console.log('Error while connecting to MongoDB')
   }
   console.log(`Listening on PORT :${PORT}`)
})