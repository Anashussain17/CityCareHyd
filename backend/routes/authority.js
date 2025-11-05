// routes/authority.js
import express from "express";
import multer from "multer";
import dotenv from"dotenv"
import path from "path";
import Issue from "../models/Issue.js";
import resolvedEmail from "../workers/resolvedEmail.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config()

const router = express.Router();

// Configure multer for resolved uploads (separate folder)
const resolvedStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "resolveduploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const resolvedUpload = multer({ storage: resolvedStorage });

// DASHBOARD 
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find().lean();

    const stats = {
      total: issues.length,
      pending: issues.filter((i) => i.status === "Pending").length,
      inProgress: issues.filter((i) => i.status === "In Progress").length,
      resolved: issues.filter((i) => i.status === "Resolved").length,
    };

    // Area-wise counts
    const areasMap = {};
    issues.forEach((i) => {
      if (!areasMap[i.constituency]) {
        areasMap[i.constituency] = { name: i.constituency, pending: 0, inProgress: 0, resolved: 0 };
      }
      if (i.status === "Pending") areasMap[i.constituency].pending++;
      else if (i.status === "In Progress") areasMap[i.constituency].inProgress++;
      else if (i.status === "Resolved") areasMap[i.constituency].resolved++;
    });
    const areas = Object.values(areasMap);

    const recentIssues = issues
      .slice()
      .sort((a, b) => {
        const au = (a.upvotes && a.upvotes.length) || 0;
        const bu = (b.upvotes && b.upvotes.length) || 0;
        if (bu !== au) return bu - au;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 10);

    res.json({ stats, areas, recentIssues });
  } catch (err) {
    console.error("authority/dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// AREA ISSUES (with counts)
router.get("/area/:areaName", authMiddleware, async (req, res) => {
  try {
    const { areaName } = req.params;
    const issues = await Issue.find({ constituency: areaName }).lean();

    // counts
    const pendingCount = issues.filter((i) => i.status === "Pending").length;
    const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

    issues.sort((a, b) => {
      const au = (a.upvotes && a.upvotes.length) || 0;
      const bu = (b.upvotes && b.upvotes.length) || 0;
      if (bu !== au) return bu - au;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ success: true, issues, pendingCount, resolvedCount });
  } catch (err) {
    console.error("authority/area error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ISSUE DETAILS FOR AUTHORITY 
router.get("/issue/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).lean();
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json({ success: true, issue });
  } catch (err) {
    console.error("authority/issue error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// AUTHORITY COMMENT on ISSUE 
router.post("/issue/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Comment text required" });

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const newComment = {
      name: "Authority",
      text,
      time: new Date(),
    };

    issue.comments.push(newComment);
    await issue.save();

    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error("authority/comment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// RESOLVE: Upload resolved proof photo 
router.post("/issue/:id/resolve", authMiddleware, resolvedUpload.single("resolvedPhoto"), async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

   issue.resolvedPhoto = `/resolveduploads/${req.file.filename}`;
   issue.status = "Resolved";
     
    
    await issue.save();
  

      await resolvedEmail({
        to: issue.reportedByEmail,
        subject: "✅ Your Reported Issue Has Been Resolved!",
        body: `
          <p>Hello,</p>
          <p>Good news! The issue you reported has been successfully <b>resolved</b> 🎉</p>
          
          <p><b>Issue:</b> ${issue.title}</p>
          <p><b>Location:</b> ${issue.constituency}</p>
          <p><b>Status:</b> Resolved ✅</p>    
          <br/><br/>
          <p>Thank you for helping improve our city!</p>
          <b>ReportMLA Team</b>
        `
      });
    


    res.json({ success: true, url: issue.resolvedPhoto });
  } catch (err) {
    console.error("authority/resolve error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
