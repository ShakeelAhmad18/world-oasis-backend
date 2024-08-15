const mongoose=require('mongoose')

const bookingSchema=mongoose.Schema(
    {
        guestId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Guests'
        },
        cabinId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Cabins'
        },
        startDate:{
            type:Date
        },
        endDate:{
            type:Date
        },
        numGuests:{
            type:Number
        },
        numNights:{
            type:Number
        },
        cabinPrice:{
            type:Number
        },
        extraPrice:{
            type:Number
        },
        totalPrice:{
            type:Number
        },
        status:{
            type:String,
            enum: ['pending', 'confirmed', 'cancelled'], // Define possible status values
            default: 'pending',
        },
        hasBreakfast:{
            type:Boolean,
            default:false
        },
       isPaid:{
        type:Boolean,
        default:false
       },
       observation:{
        type:String
       }
    },
    {
      timestamps:true
    }
)

 const booking=mongoose.model('Booking',bookingSchema)

 module.exports=booking