
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv"
dotenv.config()
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match❌" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ email, passwordHash });
    await newUser.save();

    res.json({ message: "Signup successful!✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

let adminEmails=["anas@anashussain.xyz"]
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user){
      console.log("❌ No account found for:", email);
      return res.status(404).json({ message: "No account found with this email.❌" });} 

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password ❌. Please try again." });
if(adminEmails.includes(user.email)){
  user.isAdmin=true
  await user.save()
} 
   //token
    const token = jwt.sign({ userId: user._id, email: user.email, isAdmin:user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful✅", token:token,isAdmin:user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
