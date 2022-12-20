const jwt = require("jsonwebtoken")
const organizationModel = require("../models/organizationModel.js")
const propertyModel = require("../models/propertyModel.js")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId //no schema

//one time login? no token?
const registerOrganization = async function(req,res){

    try{let {organizationName, password} = req.body

    //validation
    if(typeof organizationName !="string")
    return res.status(400).send({status:false,message:"organizationName should be given in string"})
    if (organizationName.trim()=="")
    return res.status(400).send({status:false,message:"organizationName should be non empty string"})
    if(typeof password !="string")
    return res.status(400).send({status:false,message:"password should be given in string"})
   if(password.trim()=="")
   return res.status(400).send({status:false,message:"password should be non empty string "})

   const check = await organizationModel.findOne({organizationName})
   if(check)
   return res.status(400).send({status:false, message:"organization already exist"})


    const data = await organizationModel.create({organizationName, password})

    return res.status(201).send({status:true, message:data})
}
catch(err)
{return res.status(500).send({status:false, message:err.message})}
}

const loginOrganization = async function(req,res){

    try{let {organizationName, password} = req.body

    //validation
    if(typeof organizationName !="string")
    return res.status(400).send({status:false,message:"organizationName should be given in string"})
    if (organizationName.trim()=="")
    return res.status(400).send({status:false,message:"organizationName should be non empty string"})
    if(typeof password !="string")
    return res.status(400).send({status:false,message:"password should be given in string"})
   if(password.trim()=="")
   return res.status(400).send({status:false,message:"password should be non empty string "})

   const data = await organizationModel.findOne({organizationName,password})
   if(!data)
   return res.status(404).send({status:false, message:"Org not found"})

   const token = jwt.sign({organizationId:data._id},"secretKey1234")

   return res.status(200).send({status:true,organizationId:data._id, token})}
   catch(err)
    {return res.status(500).send({status:false, message:err.message})}

}

const addProperty = async function(req,res){

    try{//give property name and organizationId
    const {propertyName, organizationId} = req.body

    //property validation
    if(typeof propertyName !="string")
    return res.status(400).send({status:false,message:"propertyName should be given in string"})
    if (propertyName.trim()=="")
    return res.status(400).send({status:false,message:"propertyName should be non empty string"})
    
    //unique property
    const check = await propertyModel.findOne({propertyName})
    if(check)
    return res.status(400).send({status:false, message:"property already exist"})

    if(!ObjectId.isValid(organizationId))
    return res.status(400).send({status:false, message: "invalid organizationId"})

    //authorization
    if(organizationId !=  req.headers["orgId"])
    return res.status(403).send({status:false, message:"Organization not authorized"})

    //valid organizationId
    const orgData = await organizationModel.findById(organizationId)
    if(!orgData)
    return res.status(404).send({status:false, message:"No such organization found"})

    const data = await propertyModel.create({propertyName,organizationId})

    const organizationData = await organizationModel.findOneAndUpdate({_id:organizationId},{$push:{properties:data._id}},{new:true}).populate("properties")

    return res.status(201).send({status:true, message:"Organization Data", data:organizationData})}
    catch(err)
   {return res.status(500).send({status:false,message:err})}


}

module.exports = {registerOrganization, loginOrganization, addProperty}