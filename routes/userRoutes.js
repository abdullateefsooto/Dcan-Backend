const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getUsers, deleteUser, toggleBlockUser } = require("../controllers/userController");
const User = require("../models/User");

// Existing routes
router.get("/", protect, getUsers);
router.delete("/:id", protect, deleteUser);
router.put("/block/:id", protect, toggleBlockUser);

// ✅ New route: get admin count
router.get("/admin-count", protect, async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "admin" });
    res.json({ adminCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
