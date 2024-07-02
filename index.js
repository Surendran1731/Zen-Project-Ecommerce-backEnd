import express from 'express'
import dotenv from 'dotenv'
import connectDB from './database/db.js';
import cors from 'cors'


//Importing routers
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js"

const app=express()
dotenv.config();

//using Middlewares
app.use(express.json())
app.use(cors())

const port=process.env.PORT;


//using Routes
app.use('/api',userRoutes)
app.use('/api',productRoutes)
app.use('/api',cartRoutes)
app.use('/api',addressRoutes)
app.use('/api',orderRoutes)



app.use("/uploads", express.static("uploads")); //  this will help us to fetch image from server url

app.listen(port,()=>{
     console.log(`Server is Running on http://localhost:${port}`);
     connectDB();
})