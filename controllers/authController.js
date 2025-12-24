const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");

/**
 * REGISTER USER
 * - Frontend sends: wantsAdmin (boolean)
 * - Backend decides role
 * - Max 5 admins allowed
 */


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // Count current admins
  const adminCount = await User.countDocuments({ role: "admin" });

  let userRole = "user";
  if (role === "admin" && adminCount < 5) {
    userRole = "admin"; // allow admin only if less than 5 exist
  }

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


/**
 * LOGIN USER
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 🚫 BLOCKED USER CHECK
  if (user.blocked) {
    return res.status(403).json({ message: "Your account is blocked." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
};
