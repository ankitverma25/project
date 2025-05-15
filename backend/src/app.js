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
import dealerRouter from '../router/dealer.router.js';
import bidRouter from '../router/bid.router.js';
import adminRouter from '../router/admin.router.js';
import pickupRouter from '../router/pickup.router.js';

app.use('/admin',adminRouter);
app.use('/user', userRouter);
app.use('/car', carRouter);
app.use('/dealer', dealerRouter);
app.use('/bid', bidRouter);
app.use('/pickup', pickupRouter.default || pickupRouter);




export default app;