const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET all users (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password"); // exclude password
  res.json(users);
});

// DELETE user (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
});

// BLOCK / UNBLOCK user
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.blocked = !user.blocked; // toggle blocked status
  await user.save();
  res.json({ message: `User is now ${user.blocked ? "blocked" : "active"}` });
});

module.exports = {
  getUsers,
  deleteUser,
  toggleBlockUser,
};
