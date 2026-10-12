// utils/imageUpload.js
// One place for photo uploads (issue photos and resolution proofs).
//
// Files are kept in memory, checked, then sent to Cloudinary. Render's disk is
// wiped on every deploy or restart, so saving uploads there loses them.
// Without Cloudinary keys (local development) photos are saved to disk instead.
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { uploadBufferToCloudinary } from "./uploadToCloudinary.js";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES[file.mimetype]) return cb(null, true);
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  },
});

// Express middleware: accepts one image in `field` and turns upload problems
// into a 400 with a readable message instead of a 500.
export const acceptImage = (field) => (req, res, next) => {
  upload.single(field)(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller"
        : "Only JPG, PNG or WebP images are allowed";
    res.status(400).json({ success: false, message });
  });
};

const cloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

// Stores the photo and returns the URL to save on the issue.
// folder: "issues" or "resolved"
export async function saveImage(file, folder) {
  if (cloudinaryConfigured()) {
    const result = await uploadBufferToCloudinary(file.buffer, `reportmla/${folder}`);
    return result.secure_url;
  }

  // Local development fallback, served by express.static in server.js
  const dir = folder === "resolved" ? "resolveduploads" : "uploads";
  const name = `${Date.now()}${ALLOWED_TYPES[file.mimetype]}`;
  await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), dir, name), file.buffer);
  return `/${dir}/${name}`;
}
