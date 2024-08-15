
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto=require('crypto')
const tokens = require("../models/tokenModel")
const sendEmail = require("../utils/sendEmail")
const Guest = require('../models/guestsModel')

//generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.TWT_SECRET, { expiresIn: "1d" })
  }


  //register guest
  const registerGuest = asyncHandler(async (req, res) => {
    const { name, email, password,nationalID } = req.body;
  
    //validators
    if (!name || !email || !password || !nationalID) {
      res.status(400)
      throw new Error('Please fill all fields')
    }
  
    //find email already exist or not
    const ExistEmail = await Guest.findOne({ email })
  
    if (ExistEmail) {
      res.status(400)
      throw new Error('Email Already Exist')
    }
  
    if (password.length < 6) {
      res.status(400)
      throw new Error('Password must be up to 6 character')
    }

    //Create a user
  const guests = await Guest.create({
    name,
    email,
    password,
    nationalID
  });

  //   Generate Token
  const token = generateToken(guests._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (guests) {
    const { _id,name,email,nationalID,natinality,countryFlag ,role } = guests;
    res.status(201).json({
      _id,
      name,
      email,
      natinality,
      nationalID,
      countryFlag,
      role,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
})

//login the guest

const loginGuest=asyncHandler( async (req,res)=>{
    const {email,password}=req.body;
  
    //validate request
    if(!email || !password){
      res.send(400)
      throw new Error('Enter Email and Password')
    }
  
  //find user exist
  const user=await Guest.findOne({email});
  
  
  
  if(!user){
    res.status(400)
    throw new Error('User not found,Please SignUp')
  }
  
  //token generate
  const token=generateToken(user._id)
  
  //check password
  const passwordIsCorrect=await bcrypt.compare(password,user.password)
  
  if(passwordIsCorrect){
  
  //send HTTP-only cookie
    res.cookie("token",token,{
      path:'/',
      httpOnly:true,
      expires:new Date(Date.now() + 1000 * 86400), //1 day
      sameSite:'none',
      secure:true
    })
  }
  
  if(user && passwordIsCorrect){
    const {_id,name,email,nationalID,natinality,countryFlag,role}=user;
    res.status(201).json(
      {
        _id,
        name,
        email,
        natinality,
        nationalID,
        countryFlag,
        role,
        token
      }
    )
  }else{
    res.status(400)
    throw new Error('Invalid Details')
  }
  })
  

  //logout guest

  //logout user

const logoutGuest=asyncHandler( async (req,res)=>{

    res.cookie('token','',{
      path:'/',
      httpOnly:true,
      expires:new Date(0),
      sameSite:"none",
      secure:true
    })

    return res.status(200).json({message:'Successfully Logout'})
} )


//get Guest data

const getGuest=asyncHandler( async (req,res)=>{

    const guests=await Guest.findById(req.guests._id)
  
    if(guests){
  
      const {_id,name,email,natinality,nationalID,countryFlag,phone,role}=guests
      res.status(200).json({
        _id,
        name,
        email,
       natinality,
       nationalID,
       countryFlag,
       phone,
       role
      })
  
      }else{
        res.status(401)
        throw new Error('Invlid details')
      }
  
  } )

  //check the login status
const loginStatus=asyncHandler( async (req,res)=>{
    const token= req.cookies.token;
 
    if(!token){
     return res.json(false)
    }
 
    //verified the token
    const verified=jwt.verify(token,process.env.TWT_SECRET);
    if(verified){
     return res.json(true)
    }
    return res.json(false)
 
 } )

 //Update Guest
 const updateGuest=asyncHandler( async (req,res)=>{

    const guests=await Guest.findById(req.guests._id)
  
    if(guests){
       const {name,email,phone,natinality,nationalID,countryFlag,role}=guests;
       
       guests.name= req.body.name || name;
       guests.email=email;
       guests.natinality=req.body.natinality || natinality;
       guests.nationalID=req.body.nationalID || nationalID
       guests.phone=req.body.phone || phone;
       guests.countryFlag=req.body.countryFlag || countryFlag
       guests.role=req.body.role || role
    }
  
    const updateGuests=await guests.save()
  
    res.status(200).json({
      _id:updateGuests._id,
      name:updateGuests.name,
      natinality:updateGuests.natinality,
      phone:updateGuests.phone,
      nationalID:updateGuests.nationalID,
      countryFlag:updateGuests.countryFlag,
      role:updateGuests.role
    })
  
  })


module.exports={
    registerGuest,
    loginGuest,
    logoutGuest,
    getGuest,
    loginStatus,
    updateGuest,
}