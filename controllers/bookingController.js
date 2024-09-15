const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const axios =require('axios')
const {format} =require('date-fns')


//create booking

const createBooking = asyncHandler(async (req, res) => {
  const { startDate, endDate, numGuests, numNights, cabinPrice, extraPrice, totalPrice, observation } = req.body;

  if (!startDate || !endDate || !numGuests || !numNights || !cabinPrice) {
    res.status(400);
    throw new Error('Fill all fields');
  }

  let booking = await Booking.create({
    guestId: req.guests.id,
    cabinId: req.cabin.id,
    startDate,
    endDate,
    numGuests,
    numNights,
    cabinPrice,
    extraPrice,
    totalPrice,
    observation,
  });

  res.status(201).json(booking);

  
});



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

//send conformition email

const sendEmail = asyncHandler(async (req, res) => {
    const {  user_name,
      user_email,
      name,
      numNights,
      numGuests,
      startDate,
      endDate,
      totalPrice
    } = req.body;
  
    const apiKey = 'mlsn.0a6a4bc1dbd66ef5243add8c9730fa0b76f48f563ce794716eb44f8a355f323a';
  
    const emailData = {
      from: {
        email: 'no-reply@trial-jy7zpl9r2r3l5vx6.mlsender.net', // Use a valid email address
        name: 'The world Oasis',
      },
      to: [
        {
          email: user_email,
          name: user_name,
        },
      ],
      subject: 'Booking Confirmation',
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
  .card {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    max-width: 500px;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e0e0e0;
  }

  .card-header, .card-footer {
    background-color: #f8f8f8;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }

  .card-header h1 {
    color: #4A90E2;
    font-size: 24px;
    margin-bottom: 10px;
  }

  .card-header p {
    font-size: 16px;
    margin-bottom: 0;
    color: #555;
  }

  .card-body {
    padding: 20px;
  }

  .card-body h2 {
    color: #333;
    font-size: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #4A90E2;
    padding-bottom: 10px;
  }

  .card-body p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 15px;
  }

  .highlight {
    font-weight: bold;
    color: #E94E77;
  }

  .card-footer {
    font-size: 14px;
    color: #777;
  }
</style>
    </head>
    <body>
        <div class="card">
  <div class="card-header">
    <h1>Dear ${user_name}</h1>
    <p>Thank you for choosing The World Oasis. We wish you a wonderful experience.</p>
  </div>
  <div class="card-body">
    <h1>Your booking has been confirmed</h1>
    <h2>Booking Details</h2>
    <p>Cabin Name: <span class="highlight">${name}</span></p>
    <p>Number of Nights: <span class="highlight">${numNights}</span></p>
    <p>Number of Guests: <span class="highlight">${numGuests}</span></p>
    <p>Your Reserved Dates: <span class="highlight">${format(new Date(startDate),'EEE, MMM dd yyyy')}</span> - <span class="highlight">${format(new Date(endDate),'EEE, MMM dd yyyy')}</span></p>
    <p>Total Price to Pay: <span class="highlight">$${totalPrice}</span></p>
  </div>
  <div class="card-footer">
    <p>Best regards,<br>Team World Oasis</p>
  </div>
</div>

    </body>
    </html>
     `,
   };
  
    try {
      const response = await axios.post('https://api.mailersend.com/v1/email', emailData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      res.status(200).send('A Booking Confirmation Email Send to You');
    } catch (error) {
      console.error('Error:', error.toJSON());
      res.status(500).send(`Failed to send email: ${JSON.stringify(error.response ? error.response.data : error.message)}`);
    }
  });
  
 

module.exports={
    createBooking,
    getBooking,
    getBookingDatesByCabinId,
    getAllBooking,
    updateBooking,
    deleteBooking,
    getBookingWithCabinDetails,
    adminAllBooking,
    sendEmail,
}

