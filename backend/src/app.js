import express from "express";
import cors from 'cors';


const app=express();
app.use(cors(
    {
        origin: '*',      
    }
));
app.use(express.json());







//import routers
import userRouter from '../router/user.router.js';


app.use('/user', userRouter);




export default app;