// utils/multerCloudinary.js
import multer from "multer";

export const memoryStorage = multer.memoryStorage();
export const uploadMemory = multer({ storage: memoryStorage });
