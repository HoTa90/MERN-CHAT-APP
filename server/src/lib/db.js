import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully!');

    } catch (err){
        console.log("Could not connect to MongoDB - error: ", err.message)
    }
} 