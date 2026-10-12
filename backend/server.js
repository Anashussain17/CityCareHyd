import express from "express";
import dotenv from "dotenv"
dotenv.config()
// import mongoose from "mongoose";
import cors from "cors";
import path from "path";

//Routes or Controllers
import authRoutes from "./routes/auth.js";
import issueRoutes from "./routes/issues.js";
import authorityRoutes from "./routes/authority.js";
//Database Connection
import "./dbConnect.js"


const app = express();
const PORT=process.env.PORT
// Middleware
// In production only the listed frontend(s) may call the API (CORS_ORIGINS).
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : {}));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// serve resolved uploads
app.use("/resolveduploads", express.static(path.join(process.cwd(), "resolveduploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/authority", authorityRoutes);

app.get("/", (req, res) => {
  res.status(200).send("CityCare backend is running smoothly 🚀");
});

app.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}✅`);
})