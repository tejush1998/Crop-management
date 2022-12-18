const express = require('express')
const route = express.Router() //function
const cropController = require("./controllers/cropController.js")
const propertyController = require("./controllers/propertyController.js")
const organizationController = require("./controllers/organizationController.js")

const regionController = require("./controllers/regionController.js")

route.post("/registerOrganization", organizationController.registerOrganization)
route.post("/loginOrganization", organizationController.loginOrganization)

route.post("/addProperty", cropController.authentication,organizationController.addProperty) //only diff from region is it has owner
route.post("/addRegion",cropController.authentication,cropController.cropCycleValidation,regionController.addRegion)//requires property Id
route.post("/addChildRegion",cropController.authentication,cropController.cropCycleValidation,regionController.addChildRegion) // requires region Id

route.post("/getPropertyCycle", propertyController.getPropertyCycle)
route.post("/getFieldCycle", propertyController.getFieldCycle)

route.post("/createCrop",cropController.createCrop) //add crop to database with season
route.get("/getCrops",cropController.getCrops) //add crop to database with season

module.exports = route
