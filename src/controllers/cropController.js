const cropModel = require('../models/cropModel.js')
const ObjectId = require('mongoose').Types.ObjectId
const jwt  = require('jsonwebtoken')

const createCrop  = async function(req,res){

    try{let {cropName, season} = req.body

    //validation
    if(typeof cropName !="string")
    return res.status(400).send({status:false,message:"cropName should be given in string"})
    if (!/^[A-Za-z ]+$/.test(cropName))
    return res.status(400).send({status:false,message:"cropName should be containing alphabets only"})
    if(typeof season !="string")
    return res.status(400).send({status:false,message:"season should be given in string"})
   if(!["rabi","kharif","zaid"].includes(season))
   return res.status(400).send({status:false,message:"season should be given either rabi, kharif or zaid "})

   //uniqueness
   const check = await cropModel.findOne({cropName})
   if(check)
   return res.status(400).send({status:false,message:"crop already exist"})

   //create
   const data = await cropModel.create({cropName,season})
   return res.status(201).send({status:true,message:data})
   
    }
   catch(err)
   {return res.status(500).send({status:false,message:err})}
}

const getCrops = async function(req,res){

    const data = await cropModel.find()

    return res.status(200).send({status:true, message:data})
}

const cropCycleValidation = async function(req,res,next){

   
    let {cropCycle,field }= req.body 
    let finalData =[]
    if(field==false)
    return next()

    if(typeof cropCycle!="object")
    return res.status(400).send({status:false, message:"send cropCycle in arrray of ObjectId format"})

    for(let i=0; i<cropCycle.length;i++)
    {
        if(!ObjectId.isValid(cropCycle[i]))
        return res.status(400).send({status:false, message:`${cropCycle[i]} is invalid cropId` })
        let cropData = await cropModel.findById(cropCycle[i])
        if(!cropData)
        return res.status(400).send({status:false, message:`${cropCycle[i]} crop doesn't exist` })
        
        finalData.push(cropData.season)
    }
    let display = finalData.join(",")
    if(!(finalData.includes("kharif") && finalData.includes("rabi") && finalData.includes("zaid") && finalData.length==3))
    return res.status(400).send({status:false,message:`Make sure to give one crop for each season rabi, kharif and zaid. Yours are ${display}`})

    next()
}

const authentication = async function(req,res,next)
{

    const token = req.headers["x-api-key"]
    // const token = jwt.sign({organizationId:data._id},"secretKey1234")


    jwt.verify(token, "secretKey1234" , function(err,result)
    {
        if(err)
        return res.status(401).send({status:false, message:"invalid token given"})

        req.headers["orgId"] = result.organizationId

        next()
    })
}

module.exports = {createCrop, getCrops, cropCycleValidation, authentication}

