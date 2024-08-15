const asyncHandler = require('express-async-handler')
const Sitting = require('../models/sittingModel');



//create siiting

const createSitting=asyncHandler( async (req,res)=>{

    const {maxBookinglength,minBookinglength,maxGuestPerBooking,breakFastPrice}=req.body;

    if(!maxBookinglength,!minBookinglength,!maxGuestPerBooking,!breakFastPrice){
        res.status(401)
        throw new Error('Fill all fields')
    }

    const sitting=await Sitting.create(
        {
            maxBookinglength,
            minBookinglength,
            maxGuestPerBooking,
            breakFastPrice
        }
    )

    res.status(201).json(sitting)
} )


//get sittings

const getSittings=asyncHandler( async (req,res)=>{

    const sittings=await Sitting.find();
    res.status(200).json(sittings)

} )

const updateSittings=asyncHandler( async (req,res)=>{

  const {maxBookinglength,minBookinglength,maxGuestPerBooking,breakFastPrice}=req.body;
  const {id}=req.params;

  if(!id){
    res.status(400)
    throw new Error('Id not Found')
  }
  
  const update=await Sitting.findByIdAndUpdate({_id:id},{
    maxBookinglength,
    minBookinglength,
    maxGuestPerBooking,
    breakFastPrice
  },{
    new:true
  })

  res.status(200).json(update)
  


} )


module.exports={
    createSitting,
    getSittings,
    updateSittings,
}



