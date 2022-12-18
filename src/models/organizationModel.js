const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const organizationSchema = new mongoose.Schema({

    organizationName:{type:String, required:true},

    password:{type:String, required:true},

    properties : {type:[ObjectId]
        , default:[]
        ,ref:"Property"
    
    }

}, {timestamps:true})

module.exports = mongoose.model("Organization",organizationSchema)