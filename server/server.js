import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoutes from './Routes/userRoutes.js'

const app=express();
const PORT= process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); //body parser
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded form data
connectDB(); //DB connect

//Routes
app.get('/',(req,res)=>{
    res.send("Server started");
}) 

app.use('/user',userRoutes);
app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`)
})