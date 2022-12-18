const ObjectId = require("mongoose").Types.ObjectId
const cropModel = require("../models/cropModel")
const propertyModel = require("../models/propertyModel.js")
const regionModel = require("../models/regionModel")

const getPropertyCycle = async function(req,res){

    let {propertyId} = req.body

    if(!ObjectId.isValid(propertyId))
    return res.status(400).send({status:false, message:"wrong propertyId given"})
    const propData = await propertyModel.findById(propertyId).populate("regions")
    if(!propData)
    return res.status(404).send({status:false, message:"No such property found"})

    let final=new Set()


    let regionsFunc = async function(ele)
    {
        let x=ele.regions
        if(x.length==0)
        return
        else
        {
            for(let i=0;i<x.length;i++)
            {
                let data = await regionModel.findById(x[[i]])
                let z=data.cropCycle.join(",")
                if(z!="")
                final.add(z)
               
                regionsFunc(data)
            }
        }
    }

    await regionsFunc(propData)
    let cropCycles = [...final]
    let output=[]
    for(let i=0;i<cropCycles.length;i++)
    {
        let crops = cropCycles[i].split(",")
        let onecycle=[]
        for(let j=0;j<3;j++)
        {
            let data = await cropModel.findById(crops[j])
            onecycle.push(data.cropName)
        }
        output.push(onecycle)
    }
    return res.status(200).send({status:false,propertyCycles:output})
}

const getFieldCycle = async function(req,res){

    const {regionId} = req.body

    const data = await regionModel.findById({_id:regionId}).populate("cropCycle")

    return res.status(200).send({status:true,message:data})

}

module.exports = {getPropertyCycle,getFieldCycle}


