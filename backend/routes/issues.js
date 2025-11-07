// routes/issues.js
import express from "express";
import multer from "multer";
import path from "path";

//Models
import Issue from "../models/Issue.js";

//Middleware
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
import { uploadMemory } from "../utils/multerCloudinary.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";


// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create a new issue
router.post("/", authMiddleware,upload.single("image"), async (req, res) => {
  try {
    const { constituency, title, description, category, latitude, longitude } = req.body;
    
    let imageUrl = null;

    // If image uploaded, push to Cloudinary
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, "citycare/issues");
      imageUrl = result.secure_url;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required to report an issue",
      });
    }
    const newIssue = new Issue({
      constituency,
      title,
      description,
      category,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      
      location: {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
      createdBy: "Citizen",
     
reportedByEmail: req.user.email, 
    });

    await newIssue.save();
    res.status(201).json({ success: true, message: "Issue reported successfully", issue: newIssue });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get issue counts per constituency
router.get("/counts",authMiddleware, async (req, res) => {
  try {
    const counts = await Issue.aggregate([
      { $group: { _id: "$constituency", count: { $sum: 1 } } }
    ]);

    // Convert to object { Amberpet: 3, Khairatabad: 5, ... }
    const result = {};
    counts.forEach(c => {
      result[c._id] = c.count;
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching issue counts:", err);
    res.status(500).json({ error: "Failed to fetch issue counts" });
  }
});

// Get issue by ID
router.get("/:id", authMiddleware,async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

   res.json({ issue, comments: issue.comments });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all issues for a constituency
router.get("/constituency/:constituency",authMiddleware, async (req, res) => {
  try {
    const { constituency } = req.params;
    const issues = await Issue.find({ constituency }).sort({ createdAt: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Upvote an issue
router.post("/:id/upvote", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // From token

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });

    // Prevent duplicate upvote
    if (issue.upvotes.includes(userId)) {
      return res.status(400).json({ success: false, message: "You already upvoted this issue" });
    }

    issue.upvotes.push(userId);
    await issue.save();

    res.json({ success: true, upvotes: issue.upvotes });
  } catch (error) {
    console.error("Error upvoting:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// Add new comment
router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const newComment = {
      name: issue.createdBy, 
      text,
      time: new Date(),
    };

    issue.comments.push(newComment);
    await issue.save();

    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;

