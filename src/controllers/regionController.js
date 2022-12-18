let regionModel = require("../models/regionModel")
let propertyModel = require("../models/propertyModel")
const ObjectId = require("mongoose").Types.ObjectId

const addRegion = async function(req,res){

    //handle if regionId given, then make it child region, if flag true then make it field
    //regionId, field flag, propertyId
    let {field, propertyId, regionName,cropCycle,location} = req.body

    //validations
    if(typeof regionName !="string")
    return res.status(400).send({status:false,message:"regionName should be given in string"})
    if (regionName.trim()=="")
    return res.status(400).send({status:false,message:"regionName should be non empty string"})
    if(!ObjectId.isValid(propertyId))
    return res.status(400).send({status:false, message:"wrong propertyId given"})
    if(typeof field !="boolean")
    return res.status(400).send({status:false, message:"field should be boolean value: true of false"})

    //unique region
    const check = await regionModel.findOne({regionName})
    if(check)
    return res.status(400).send({status:false, message:"region already exist"})

    //valid propertyId
    const propData = await propertyModel.findById(propertyId)
    if(!propData)
    return res.status(404).send({status:false, message:"No such property found"})
    let data =0
    let organizationId=propData.organizationId

    //authorization
    if(organizationId !=  req.headers["orgId"])
    return res.status(403).send({status:false, message:"Organization not authorized"})

    if(field==true)
     {
        if (!(/^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/.test(location)))
        return res.status(400).send({status:false,message:"give location in format integer,integer"})

        let check = await regionModel.findOne({location}) 
        if(check)
        return res.status(400).send({status:false, message:"location already exist"})
    
        data = await regionModel.create({regionName,field,cropCycle,organizationId,location})
     }
     else{
        if(cropCycle || location)
        return res.status(400).send({status:"false", message:"cropcycle and location will only be accepted for field:true"})
     data = await regionModel.create({regionName,field,organizationId})
    }

    const propertyData = await propertyModel.findOneAndUpdate({_id:propertyId},{$push:{regions:data._id}},{new:true}).populate("regions")

    return res.status(201).send({status:true, message:"Property data",data:propertyData})

}
const addChildRegion = async function(req,res){

    //handle if regionId given, then make it child region, if flag true then make it field
    //regionId, field flag, propertyId
    let {field, regionId, regionName, cropCycle,location} = req.body

    //validations
    if(typeof regionName !="string")
    return res.status(400).send({status:false,message:"regionName should be given in string"})
    if (regionName.trim()=="")
    return res.status(400).send({status:false,message:"regionName should be non empty string"})
    if(!ObjectId.isValid(regionId))
    return res.status(400).send({status:false, message:"wrong regionId given"})
    if(typeof field !="boolean")
    return res.status(400).send({status:false, message:"field should be boolean value: true of false"})

    //unique region
    const check = await regionModel.findOne({regionName})
    if(check)
    return res.status(400).send({status:false, message:"region already exist"})

    //valid regionId
    const regData = await regionModel.findById(regionId)
    if(!regData)
    return res.status(404).send({status:false, message:"No such region found"})
    //check if field
    if(regData.field==true)
    return res.status(404).send({status:false, message:"Given regionId is a field. No child region possible"})

    let data=0
    let organizationId=regData.organizationId

    //authorization
    if(organizationId !=  req.headers["orgId"])
    return res.status(403).send({status:false, message:"Organization not authorized"})


    if(field==true)
    {
        //check location data
        if (!(/^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/.test(location)))
        return res.status(400).send({status:false,message:"give location in format integer,integer"})
        
        let check = await regionModel.findOne({location}) 
        if(check)
        return res.status(400).send({status:false, message:"location already exist"})
    
        data = await regionModel.create({regionName,field,cropCycle,organizationId,location})
     }    else{

        if(cropCycle || location)
        return res.status(400).send({status:"false", message:"cropcycle and location will only be accepted for field:true"})
    data = await regionModel.create({regionName,field,organizationId})
        }


    const regionData = await regionModel.findOneAndUpdate({_id:regionId},{$push:{regions:data._id}},{new:true}).populate("regions")

    return res.status(201).send({status:true, message:"Region data",data:regionData})

}
module.exports ={addRegion,addChildRegion}