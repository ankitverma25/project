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
import carRouter from '../router/car.router.js';


app.use('/user', userRouter);
app.use('/car', carRouter);




export default app;