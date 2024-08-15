const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const mongoose=require('mongoose')


//create booking

const createBooking=asyncHandler( async (req,res)=>{
   const {startDate,endDate,numGuests,numNights,cabinPrice,extraPrice,totalPrice,observation}=req.body;

   if(!startDate || !endDate || !numGuests || !numNights || !cabinPrice ){
    res.status(400)
    throw new Error('Fill all fields')
   }

    
  const bookings=await Booking.create(
    {
        guestId:req.guests.id,
        cabinId:req.cabin.id,
        startDate,
        endDate,
        numGuests,
        numNights,
        cabinPrice,
        extraPrice,
        totalPrice,
        observation
    }
  )
   res.status(201).json(bookings)
} )


//get booking by id

const getBooking=asyncHandler( async (req,res)=>{
    const {id}=req.params;

    if(!id){
        res.status(404)
        throw new Error('Id not found')
    }

    const booking=await Booking.findById(id)
    if(!booking){
        res.status(404)
        throw new Error('Cabin not found')
    }

    if(booking.guestId.toString() !== req.guests.id){
        res.status(401).json("user is Unauthorized")
       }

    res.status(200).json(booking)
} )


//get all bookings
const getAllBooking=asyncHandler( async (req,res)=>{

    const bookings=await Booking.find({guestId:req.guests._id}).populate('cabinId',"name image")
    
    if(!bookings.length){
        res.status(404).json('Booking not found')
    }

    res.status(200).json(bookings)

} )

//get allBookings that are seen by admin only

const adminAllBooking=asyncHandler( async (req,res)=>{

   const allBooking=await Booking.find().populate('guestId',"name email").populate('cabinId','name image')

   if(!allBooking){
    res.status(404).json('Bookings not found')
   }

   res.status(200).json(allBooking)

} )

  

//get booking dates by its Cabin ID
const getBookingDatesByCabinId=asyncHandler( async (req,res)=>{

    const {cabinId}=req.params;
    
    if(!cabinId){
        res.status(404)
        throw new Error('CabinId not found')
    }

    const booking=await Booking.find({cabinId}).select('startDate endDate')

    if(!booking){
        res.status(404)
        throw new Error('Booking not found with Cabin')
    }

    res.status(200).json(booking)
} )

//update booking

const updateBooking=asyncHandler( async (req,res)=>{
     
    
    const { id }=req.params;

     const { 
        startDate,
        endDate,
        numGuests,
        numNights,
        cabinPrice,
        extraPrice,
        totalPrice,
        status,
		hasBreakfast,
		isPaid,
        observation
    }= req.body 


    const booking=await Booking.findById(id)

    if(!booking){
        res.status(404)
        throw new Error("product not found")
       }

    
    if(booking.guestId.toString() !== req.guests.id){
        res.status(401).json("user is Unauthorized")
       }

    const update=await Booking.findByIdAndUpdate({_id:id},
        { startDate,
            endDate,
            numGuests,
            numNights,
            cabinPrice,
            extraPrice,
            totalPrice,
            status,
            hasBreakfast,
            isPaid,
            observation
        },
        { new:true,
          runValidators:true
        }
    )

    res.status(200).json(update)
} )


//Delete Booking
const deleteBooking=asyncHandler( async (req,res)=>{

    const {id}=req.params;

    const deleteBooking=await Booking.findByIdAndDelete(id)

    if(!deleteBooking){
        res.status(404)
        throw new Error('Booking not Found')
    }

    if(deleteBooking.guestId.toString() !== req.guests.id){
        res.status(401).json("user is Unauthorized")
       }

    res.status(200).json("booking successfully deleted")

} )


//get Booking Details with cabins details

const getBookingWithCabinDetails=asyncHandler(async (req,res)=>{

    const booking=await Booking.find({guestId:req.guests._id}).populate('cabinId',"name image")

    if(!booking){
        res.status(404) 
        throw new Error("bookig not found")
    }

    res.status(200).json(booking)
})

 

module.exports={
    createBooking,
    getBooking,
    getBookingDatesByCabinId,
    getAllBooking,
    updateBooking,
    deleteBooking,
    getBookingWithCabinDetails,
    adminAllBooking,
}