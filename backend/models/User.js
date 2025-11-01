import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
    verifyToken: { type: String },
  isVerified: { type: Boolean, default: false },
  isAdmin:{
    type:Boolean,
    default:false
  }

});

export default mongoose.model("User", userSchema);
