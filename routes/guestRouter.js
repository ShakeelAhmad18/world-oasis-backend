const express=require('express');
const { registerGuest, loginGuest, logoutGuest, getGuest, loginStatus, updateGuest } = require('../controllers/guestController');
const protecter = require('../middlewares/authMiddleware');

const router=express.Router()

router.post('/register',registerGuest)
router.post('/login',loginGuest)
router.get('/logout',protecter,logoutGuest)
router.get('/getguest',protecter,getGuest)
router.get('/status',protecter,loginStatus)
router.patch('/update',protecter,updateGuest)

module.exports=router;