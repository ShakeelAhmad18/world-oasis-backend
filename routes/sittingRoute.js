const express=require('express')
const { createSitting, getSittings, updateSittings } = require('../controllers/sittingController')

const router=express.Router()


router.post('/createsitting',createSitting)
router.get('/getsitting',getSittings)
router.patch('/update/:id',updateSittings)







module.exports=router