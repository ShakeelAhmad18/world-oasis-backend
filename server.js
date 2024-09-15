const express=require('express')
const dotenv=require('dotenv').config()
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const path=require('path')
const cabinsRoute=require('./routes/cabinRouter')
const guestRoute=require('./routes/guestRouter')
const cookieParser=require('cookie-parser')
const bookingRoute=require('./routes/bookingRouter')
const siitingRoute=require('./routes/sittingRoute')
const stripe=require('stripe')('sk_test_51PB07sDu3INfeks6K0R6pwTe6l8QyUv5cKKl0VAlsAfgxubtvDeFQxsPR4AHL3E1e1vmegESw4AoUmOIf5RzglUF00upm6Ook6')




const app=express();


//PORT

const PORT=5000;


//middlewares

app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors({
    origin:['http://localhost:3000','https://pinvent-app-taupe.vercel.app/'],
    credentials:true
}))


app.use(cookieParser())

//Routes
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use('/api/cabins',cabinsRoute)
app.use('/api/guest',guestRoute)
app.use('/api/booking',bookingRoute)
app.use('/api/sitting',siitingRoute)




app.post('/api/create-checkout-session', async (req, res) => {
    // Access the nested cabins object
    const cabin = req.body.cabins; 

    const unitAmount = Math.round(parseFloat(cabin.regularprice) * 100);
    
    // Log unitAmount to check if it's valid

    if (isNaN(unitAmount)) {
        return res.status(400).json({ error: "Invalid cabin price" });
    }

    const lineitems = [{
        price_data: {
            currency: 'usd',
            product_data: {
                name: cabin.name ? `Cabin Name: ${cabin.name}` : 'Cabin', 
            },
            unit_amount: unitAmount 
        },
        quantity: cabin.numNights
    }];

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineitems,
            mode: 'payment',
            success_url: 'http://localhost:3000/account/thankyou',
            cancel_url: 'http://localhost:3000/account/cancel'
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});







 mongoose.connect(process.env.MONGO_URI).then((req,res)=>{
    app.get('/',(req,res)=>{
        res.send('Home Page')
    })
 })



app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`)
})
