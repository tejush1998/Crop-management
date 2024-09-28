# Crop and Region Management API
## Overview
This project is designed to manage crops, regions, properties, and organizations. It allows organizations to log in, manage their properties, and define regions within those properties. Each region can either be a field or a parent region containing child regions. Regions that are fields can have a crop cycle for the three agricultural seasons: Rabi, Kharif, and Zaid.

## Key Features:
- **Organizations**: Each organization manages its properties and regions.
- **Properties**: An organization can have multiple properties.
- **Regions**: Properties can have multiple regions, which can be either fields or non-fields. Non-field regions can have child regions.
- **Crops and Crop Cycles**: Each field (region marked as a field) has a crop cycle for the three seasons.
- **Authentication**: JWT-based authentication ensures only logged-in organizations can access their properties and regions.
- **Recursion in Regions**: The system supports recursive fetching of regions and their crop cycles, even for nested regions.

## Models

### Crop Model
Represents the crops that are grown during different seasons.
```yaml
{
    cropName: { type: String, required: true, unique: true },
    season: { type: String, required: true, enum: ["rabi", "kharif", "zaid"] }
}
```
### Organization Model
Represents an organization that owns properties.
```yaml
{
    organizationName: { type: String, required: true },
    password: { type: String, required: true },
    properties: { type: [ObjectId], default: [], ref: "Property" }
}
```
### Property Model
Represents properties that belong to an organization.
```yaml
{
    organizationId: { type: ObjectId, ref: "Organization" },
    propertyName: { type: String, required: true },
    regions: { type: [ObjectId], default: [], ref: "Region" }
}
```
### Region Model
Represents regions within a property. Some regions are fields, while others are parent regions containing child regions. Fields have crop cycles.
```yaml
{
    organizationId: { type: ObjectId, ref: "Organization" },
    regionName: { type: String, required: true },
    regions: { type: [ObjectId], default: [], ref: "Region" },
    cropCycle: { type: [ObjectId], default: [], ref: "Crop" },
    location: { type: String },
    field: { type: Boolean, default: false }
}
```
