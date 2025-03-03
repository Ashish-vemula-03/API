const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model
require("dotenv").config(); // Load environment variables

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Fallback in dev

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Remove 'Bearer ' from the token if present
    const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    // Verify token
    const decoded = jwt.verify(tokenValue, SECRET_KEY);
    
    // Ensure decoded object contains userId
    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token structure." });
    }

    // Find user in the database
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
