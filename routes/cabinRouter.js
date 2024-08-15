const express=require('express')
const { createCabin, getCabins, getCabin, updateCabin, deleteCabin, getCabinPrice } = require('../controllers/cabinController');
const { upload } = require('../utils/fileUpload');
const protecter = require('../middlewares/authMiddleware');
const { varifyAdmin } = require('../middlewares/adminMiddleware');

const router=express.Router();


//Routes

router.post('/',upload.single("image"),protecter,varifyAdmin,createCabin)
router.get('/',getCabins)
router.get('/:id',getCabin)
router.patch('/:id',upload.single("image"),updateCabin)
router.delete('/:id',deleteCabin)
router.get('/price/:id',getCabinPrice)


module.exports=router;
