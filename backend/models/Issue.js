
// models/Issue.js
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    constituency: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Pothole", "Garbage", "Electricity", "Water", "Other"],
      required: true,
    },
    imageUrl: { type: String },
    resolvedPhoto: { type: String, default: null },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    // include "In Progress" because some code checks for it
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    createdBy: { type: String, required: true },
    comments: [
      {
        name: { type: String, default: "Anonymous" },
        text: String,
        time: { type: Date, default: Date.now },
      },
    ],
    upvotes: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
