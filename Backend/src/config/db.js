import mongoose from 'mongoose'
import config from './config.js'

const connectDB = async ()=>{
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to DB");
    } catch (err) {
        // Fail the deploy loudly instead of running a server that can't reach the DB
        console.error("Error connecting to DB ", err);
        process.exit(1);
    }
}


export default connectDB;
