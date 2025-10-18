import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`✅ MONGODB Connected !! DB Host: ${connectionInstance.connection.host}`)
        
    }
    catch {
        console.error("Error connecting to MongoDB database: ", error)
        process.exit(1)
    }
}

export default connectDB;