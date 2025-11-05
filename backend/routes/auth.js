
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import sendEmail from "../workers/sendEmail.js"
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

    const emailToken = (Math.random() + 1).toString(36).substring(2);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      passwordHash,
      verifyToken: emailToken
    });

    await newUser.save();

    // Send Email
    // sendEmail({
    //   to: email,
    //   subject: "ReportMLA - Email Confirmation",
    //   body: `
    //     Hello,<br/>
    //     Welcome to ReportMLA!<br/><br/>
    //     Please verify your email:<br/><br/>
    //     <a href="https://reportmla.com/api/auth/verify/${emailToken}">
    //       ✅ Verify Email
    //     </a><br/><br/>
    //     Thank you,<br/>
    //     <b>ReportMLA Team</b>
    //   `,
    // });

    res.json({ message: "Signup successful!✅" });

  } catch (err) {
    console.log(err); 
    res.status(500).json({ message: "Server error" });
  }
});


// // Verify Email
// router.get("/verify/:token", async (req, res) => {
//   try {
//     const user = await User.findOne({ verifyToken: req.params.token });

//     if (!user) {
//       return res.status(400).send("<h3>Invalid or expired token ❌</h3>");
//     }

//     user.isVerified = true;
//     user.verifyToken = null;
//     await user.save();

//     res.send("<h3>Email Verified Successfully ✅ You can now login.</h3>");
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// });



let adminEmails=["anas@anashussain.xyz"]
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user){
      console.log("❌ No account found for:", email);
      return res.status(404).json({ message: "No account found with this email.❌" });
    } 
//     if (!user.isVerified) {
//   return res.status(401).json({ message: "Please verify your email before logging in 📧" });
// }


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
