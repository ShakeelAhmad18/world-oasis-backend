const mongoose =require('mongoose')


const cobinSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        maxCapacity:{
           type:Number,
        },
        regularPrice:{
            type:Number
        },
        discount:{
            type:Number
        },
        description:{
            type:String
        },
        image:{
            type: Object,
            default: {},
        }
    },{
        timestamps:true
    }
)

const Cabins=mongoose.model('Cabins',cobinSchema)

module.exports=Cabins;