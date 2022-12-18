const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const propertySchema = new mongoose.Schema({

    organizationId:{type:ObjectId}, 
    
    propertyName:{type:String},

    regions : {type:[ObjectId]
        , default:[]
        ,ref:"Region"
    
    }

}, {timestamps:true})

module.exports = mongoose.model("Property",propertySchema)