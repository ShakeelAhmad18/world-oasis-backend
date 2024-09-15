const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken');
const Guest = require('../models/guestsModel');

const protecter=asyncHandler( async (req,res,next)=>{

  try {
    const token=req.cookies.token;
  
    if(!token){
       res.status(401)
       throw new Error('Unauthorized user,please login')
    }

    const verified=jwt.verify(token,process.env.TWT_SECRET)

    //get user id from Token

    const guests=await Guest.findById(verified.id).select('-password')
    
    if(!guests){
        res.status(404)
        throw new Error('User not found')
    }
     
    
    req.guests=guests;
    next();

  } catch (error) {
     res.status(401).json('Not Authorized User')
  }

} )

module.exports=protecter;