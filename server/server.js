import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRoutes  from './Routes/userRoutes.js'
import taskRoutes from './Routes/taskRoutes.js';

const app=express();
const PORT= process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json()); //body parser
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded form data
connectDB(); //DB connect

//Routes
app.use("/api/user",userRoutes);
app.use("/api/tasks",taskRoutes)

app.get('/',(req,res)=>{
    res.send("Server started");
}) 


app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`)
})