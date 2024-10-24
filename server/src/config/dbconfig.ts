import mongoose, { ConnectOptions } from "mongoose";
import dotenv from 'dotenv'; dotenv.config();


const connectDB = async():Promise<void>=>{
try {
await mongoose.connect(process.env.MONGO_URI as string);
console.log("\x1b[36m%s\x1b[0m","database connected ")
} catch (error) {
    console.error(error??"Failed to connect to database")
    process.exit(1)
}
}

export default connectDB;
