const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const mongoose  = require('mongoose')
mongoose.set("strictQuery", false); //strict mode for query filter on

const route = require('./route.js')
app.use(bodyparser.json())

mongoose.connect("mongodb+srv://book-management:31VMJSSWSjcdoaAO@cluster0.eemzti8.mongodb.net/assignment2?retryWrites=true&w=majority", 
{useNewUrlParser: true})
.then(() => console.log("mongoose connected"))
.catch(err => console.log(err))

app.use("/", route)

app.use(function(req,res){

    return res.status(404).send({status:false, message:"No such URL found"})
})

app.listen( process.env.PORT || 3000 , ()=>{

    console.log("express app running")
})