const mongoose = require('mongoose')
// const ObjectId = mongoose.Schema.Types.ObjectId

const cropSchema =  new mongoose.Schema({

    cropName : {type:String,required:true,unique:true},
    season :{type:String, required:true, enum:["rabi","kharif","zaid"]}

},{timestamps:true})

module.exports = mongoose.model("Crop",cropSchema)