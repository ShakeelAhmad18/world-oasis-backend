const mongoose=require('mongoose')

const stripeSchema=mongoose.Schema(
    {
      guestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Guests'
      },
      bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Booking'
      },
      status:{
        type:String,
      }
    }
)

const stripe=mongoose.model('stripe',stripeSchema)

module.exports=stripe;

