const mongoose =require('mongoose')
const bcrypt=require('bcryptjs')

const guestSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please Enter a Name']
        },
        phone:{
            type:String,
            required:[true,'Please Add Personal Phone Number'],
            default:'+9322'
        },
        email:{
            type:String,
            required:[true,"Please add a Email"],
            unique:true,
            trim:true,
            match:[
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please Enter a valid Email"
            ]
        },
        nationalID:{
          type:String,
          required:true,
          unique: true,
        },
        natinality:{
            type:String
        },
        countryFlag:{
          type:String
        },
        role:{
          type:String,
          default:'user'
        },
        password:{
            type:String,
            required:[true,'Please Enter a Password'],
            minLength:[8,'Password must contain a 8 Character']
            //maxLength:[23,'Password does not contain a more than 23 charactor']
          }
    },
    {
        timestamps:true
    }
)

//bcrypt password before saving to DB
guestSchema.pre("save",async function(next){
    if(!this.isModified('password')){
     next()
    }
 
     const salt=await bcrypt.genSalt(10)
     const hashedPassowrd=await bcrypt.hash(this.password,salt)
     this.password = hashedPassowrd;
     next()
 })

const Guests=mongoose.model('Guests',guestSchema)

module.exports=Guests