const cropModel = require('../models/cropModel.js')
const ObjectId = require('mongoose').Types.ObjectId
const jwt  = require('jsonwebtoken')
let regionModel = require("../models/regionModel")

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

   try{ const data = await cropModel.find()

    return res.status(200).send({status:true, message:data})}
    catch(err)
   {return res.status(500).send({status:false,message:err})}

}

const cropCycleValidation = async function(req,res,infoData){

   try{ let {field, regionName, cropCycle,location} = req.body
   
    //validations
    if(typeof regionName !="string")
    return res.status(400).send({status:false,message:"regionName should be given in string"})
    if (regionName.trim()=="")
    return res.status(400).send({status:false,message:"regionName should be non empty string"})
    if(typeof field !="boolean")
    return res.status(400).send({status:false, message:"field should be boolean value: true of false"})

    //unique region
    const check = await regionModel.findOne({regionName})
    if(check)
    return res.status(400).send({status:false, message:"region already exist"})

    let data =0
    let organizationId=infoData.organizationId

    //authorization
    if(organizationId !=  req.headers["orgId"])
    return res.status(403).send({status:false, message:"Organization not authorized"})

    //location for all region, cropcycle and location only for field true, one crop check
    //give try catch to all
    if(field==true)
     {
        //validate location
        if (!(/^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/.test(location)))
        return res.status(400).send({status:false,message:"give location in format integer,integer"})

        let check = await regionModel.findOne({location}) 
        if(check)
        return res.status(400).send({status:false, message:"location already exist"})

        let finalData =[]
        //validate cropCycle
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
        return res.status(400).send({status:false,message:`Make sure to give only one crop for each season rabi, kharif and zaid. Yours are ${display}`})
        //create region 
        data = await regionModel.create({regionName,field,cropCycle,organizationId,location})
     }
     else{
        //location and cropCycle shouldnt exist
        if(cropCycle || location)
        return res.status(400).send({status:"false", message:"cropcycle and location will only be accepted for field:true"})
     data = await regionModel.create({regionName,field,organizationId})
    }
    //return the created region Id
    return data._id}
    catch(err)
   {return res.status(500).send({status:false,message:err})}

}

const authentication = async function(req,res,next)
{

    try{const token = req.headers["x-api-key"]
    // const token = jwt.sign({organizationId:data._id},"secretKey1234")


    jwt.verify(token, "secretKey1234" , function(err,result)
    {
        if(err)
        return res.status(401).send({status:false, message:"invalid token given"})

        req.headers["orgId"] = result.organizationId

        next()
    })}
    catch(err)
   {return res.status(500).send({status:false,message:err})}

}

module.exports = {createCrop, getCrops, cropCycleValidation, authentication}

