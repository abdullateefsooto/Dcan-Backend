const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Public route to get number of admins
router.get("/admin-count", async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.json({ adminCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
