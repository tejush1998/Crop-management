const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const regionSchema = new mongoose.Schema({

    organizationId:{type:ObjectId}, 

    regionName:{type:String},

    regions : {type:[ObjectId]
        , default:[]
        ,ref:"Region"
    
    },

    cropCycle: {type:[ObjectId]
        , default:[]
        ,ref:"Crop"
    },
    location:{type:String},

    field:{type:Boolean, default:false}

}, {timestamps:true})

module.exports = mongoose.model("Region",regionSchema)