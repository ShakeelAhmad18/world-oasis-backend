const mongoose=require('mongoose')

const sittingSchema=mongoose.Schema(
    {
        maxBookinglength:{
            type:Number
        },
        minBookinglength:{
            type:Number
        },
        maxGuestPerBooking:{
            type:Number
        },
        breakFastPrice:{
            type:Number
        }
    },
    {
    timestamps:true
    }
)

const Sitting=mongoose.model('Sitting',sittingSchema)

module.exports=Sitting;