// Grant or remove authority access for an existing account.
// Usage: node scripts/makeAuthority.js someone@example.com          (grant)
//        node scripts/makeAuthority.js someone@example.com --remove (remove)
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

const [email, flag] = process.argv.slice(2);
if (!email) {
  console.error("Usage: node scripts/makeAuthority.js <email> [--remove]");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URL);
const user = await User.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { isAdmin: flag !== "--remove" },
  { new: true }
);
console.log(user ? `${user.email} isAdmin = ${user.isAdmin}` : `No account found for ${email}`);
await mongoose.disconnect();
