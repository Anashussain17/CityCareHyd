// middleware/requireAuthority.js
// Runs after authMiddleware. Checks the database (not just the token) so that
// removing someone's authority access takes effect immediately.
import User from "../models/User.js";

export default async function requireAuthority(req, res, next) {
  try {
    const user = await User.findById(req.user.userId).select("isAdmin");
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Authority access only" });
    }
    next();
  } catch (err) {
    console.error("requireAuthority error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
