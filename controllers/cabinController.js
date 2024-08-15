const asyncHandler = require('express-async-handler');
const cabins = require('../models/cabinsModel');
const couldinary=require('cloudinary').v2;
const path=require('path');
const { fileSizeFormatter } = require('../utils/fileUpload');



const createCabin=asyncHandler( async (req,res)=>{

    const {name,maxCapacity,regularPrice,discount,description}=req.body;
   
    if(!name || !maxCapacity || !regularPrice || !discount || !description){
       res.status(400)
       throw new Error('Please fill all fields')
   
    }
   
   //handle Upload Image
   
   let fileData={};
   if(req.file){
   
     //save image to cloudinary
     let uploadFile;
     try {
       uploadFile=await couldinary.uploader.upload(req.file.path,{
           folder:"Cabins",resource_type:'image'
       })
     } catch (error) {
       res.status(500)
       throw new Error('Images could not be uploaded')
     }
   
       fileData = {
           fileName:req.file.originalname,
           filePath:uploadFile.secure_url,
           fileType:req.file.type,
           fileSize: fileSizeFormatter(req.file.size,2)
       }
   
   }
   
   
   
   //create product
    const cabin=await cabins.create(
       {
           name,
           maxCapacity,
           regularPrice,
           discount,
           description,
           image:Object.keys(fileData).length === 0 ? 'there is error' : fileData,
       }
    )
   
    
   
     res.status(201).json(cabin)
   
   } );


   //get all cabins

   const getCabins=asyncHandler( async (req,res)=>{
       const allCabins= await cabins.find()

       res.status(200).json(allCabins)
   } )

   //get single Cabin

   const getCabin=asyncHandler( async (req,res)=>{

          const {id}=req.params;
          const cabin=await cabins.findById(id)

          if(!cabin){
            res.status(404)
            throw new Error('cabin not found')
        }
        
        res.status(200).json(cabin)

   } )

   //update cabins

   const updateCabin=asyncHandler( async (req,res)=>{
       
    const {name,maxCapacity,regularPrice,description,discount}=req.body;
    const {id}=req.params;
   
    const cabin=await cabins.findById(id)

   if(!cabin){
    res.status(404)
    throw new Error("product not found")
   }

   //handle upload Image

   let fileData={};
   if(req.file){
   
     //save image to cloudinary
     let uploadFile;
     try {
       uploadFile=await couldinary.uploader.upload(req.file.path,{
           folder:"Cabins",resource_type:'image'
       })
     } catch (error) {
       res.status(500)
       throw new Error('Images could not be uploaded')
     }
   
       fileData = {
           fileName:req.file.originalname,
           filePath:uploadFile.secure_url,
           fileType:req.file.type,
           fileSize: fileSizeFormatter(req.file.size,2)
       }
   
   }

   //update cabin

   const UpdateCabin=await cabins.findByIdAndUpdate({_id:id},
    {
        name,
        maxCapacity,
        regularPrice,
        description,
        discount,
        image:Object.keys(fileData).length === 0 ? cabin?.image : fileData,
    },
    {
     new:true,
     runValidators:true
    }
 )

 res.status(200).json(UpdateCabin)

   } )

   //delete a cabin

   const deleteCabin=asyncHandler( async (req,res)=>{
       const {id}=req.params;
       const cabin=await cabins.findById(id)

       if(!cabin){
        throw new Error('Cabin not found')
       }
     
       await cabin.deleteOne();
       res.status(200).json('Cabin deleted')
   } )

   //get Cabin price

   const getCabinPrice=asyncHandler( async (req,res)=>{
      const {id}=req.params;
      const cabin=await cabins.findById(id)

      if (!cabin) {
        res.status(404);
        throw new Error('Cabin not found');
    }
      
    res.status(200).json({
        regularPrice: cabin.regularPrice,
        discount: cabin.discount
    });

   } )

   module.exports={
    createCabin,
    getCabins,
    getCabin,
    updateCabin,
    deleteCabin,
    getCabinPrice,
   }
   


