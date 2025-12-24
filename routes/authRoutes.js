const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// ===============================
// AUTH ROUTES
// ===============================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ===============================
// PROTECTED USER INFO
// ===============================
router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

// ===============================
// CREATE ADMIN (SETUP ONLY)
// ===============================
// 🔐 Protected by ENV secret
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    // 🔐 ENV SECRET CHECK
    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🧠 ADMIN LIMIT CHECK
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount >= 5) {
      return res
        .status(403)
        .json({ message: "Admin limit reached (max 5)" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "✅ Admin account created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
