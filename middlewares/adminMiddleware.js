const asyncHandler=require('express-async-handler')
const Guest=require('../models/guestsModel')

const varifyAdmin=asyncHandler( async (req,res,next)=>{
 
    if (req.guests && req.guests.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admins only.' });
    }
} )

module.exports={varifyAdmin}