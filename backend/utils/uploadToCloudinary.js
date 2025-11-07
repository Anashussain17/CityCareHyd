// utils/uploadToCloudinary.js
import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";

export const uploadBufferToCloudinary = (buffer, folder = "citycare") => {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder }, // optional: a folder in your Cloudinary account
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(upload_stream);
  });
};
