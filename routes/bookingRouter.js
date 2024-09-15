
const express=require('express')
const { createBooking, getBooking, getBookingDatesByCabinId, getAllBooking, updateBooking, deleteBooking, getBookingWithCabinDetails, adminAllBooking, sendEmail } = require('../controllers/bookingController');
const protecter = require('../middlewares/authMiddleware');
const cabinDetails = require('../middlewares/cabinMiddleware');
const { varifyAdmin } = require('../middlewares/adminMiddleware');

const router=express.Router()


router.post('/createbooking',protecter,cabinDetails,createBooking)
router.get('/getbooking/:id',protecter,getBooking)
router.get('/getbooking/cabin/:cabinId',getBookingDatesByCabinId)
router.get('/getbookings',protecter,getAllBooking)
router.put('/update/:id',protecter,updateBooking)
router.delete('/deletebooking/:id',protecter,deleteBooking)
router.get('/getBookingwithcabin/:id',protecter,getBookingWithCabinDetails)
router.get('/admin',protecter,varifyAdmin,adminAllBooking)
router.post('/sendemail',protecter,sendEmail)


module.exports=router;
