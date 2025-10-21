const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (without password)
    req.user = await User.findById(decoded.id).select("-password");
    // if token not correct
    if (!req.user) {
      return res.status(401).json({ message: "User not found, unauthorized" });
    }

    // Continue to next middleware or controller
    next();
    //if thers's no token
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
});

module.exports = protect;
