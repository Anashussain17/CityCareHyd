import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const dbConnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to MongoDB ✅")
    }
    catch(err){
        console.log("Error connecting");
    }
}
dbConnect()
export default dbConnect()