let regionModel = require("../models/regionModel")
let propertyModel = require("../models/propertyModel")
const { cropCycleValidation } = require("./cropController")
const ObjectId = require("mongoose").Types.ObjectId

const addRegion = async function(req,res){

    try{//handle if regionId given, then make it child region, if flag true then make it field
    //regionId, field flag, propertyId
    let {propertyId} = req.body

        //valid propertyId
    //different
    if(!ObjectId.isValid(propertyId))
    return res.status(400).send({status:false, message:"wrong propertyId given"})
    
    const propData = await propertyModel.findById(propertyId)
    if(!propData)
    return res.status(404).send({status:false, message:"No such property found"})

    //await 
    let data = await cropCycleValidation(req,res,propData)
    
    if(!ObjectId.isValid(data))
    return
    //different
    const propertyData = await propertyModel.findOneAndUpdate({_id:propertyId},{$push:{regions:data}},{new:true}).populate("regions")

    return res.status(201).send({status:true, message:"Property data",data:propertyData})
}catch(err)
{return res.status(500).send({status:false,message:err})}
}
const addChildRegion = async function(req,res){

    try{//handle if regionId given, then make it child region, if flag true then make it field
    //regionId, field flag, propertyId
    let {regionId} = req.body

    if(!ObjectId.isValid(regionId))
    return res.status(400).send({status:false, message:"wrong regionId given"})

    //valid regionId
    const regData = await regionModel.findById(regionId)
    if(!regData)
    return res.status(404).send({status:false, message:"No such region found"})
    //check if field
    if(regData.field==true)
    return res.status(404).send({status:false, message:"Given regionId is a field. No child region possible"})

    let data = await cropCycleValidation(req,res,regData)
    
    if(!ObjectId.isValid(data))
    return

    const regionData = await regionModel.findOneAndUpdate({_id:regionId},{$push:{regions:data}},{new:true}).populate("regions")

    return res.status(201).send({status:true, message:"Region data",data:regionData})}
    catch(err)
    {return res.status(500).send({status:false,message:err})}
}
module.exports ={addRegion,addChildRegion}