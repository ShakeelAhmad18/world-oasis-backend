const asyncHandler =require('express-async-handler');
const Cabins = require('../models/cabinsModel');

const cabinDetails=asyncHandler( async (req,res,next)=>{
    try {
      const {cabinId}=req.body;

      if(!cabinId){
        res.status(400)
        throw new Error('CabinId Not found')
      }

      const cabin=await Cabins.findById(cabinId)

      if(!cabin){
        res.status(400)
        throw new Error("cabin not found")
      }
      
      req.cabin=cabin
      next()

    } catch (error) {
      res.status(500)
      throw new Error(error.message)
    
    }
} )

module.exports=cabinDetails;