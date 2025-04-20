import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

const connectDb = async()=>{
    try {
        await mongoose.connect(`${process.env.DB_URL}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export default connectDb;