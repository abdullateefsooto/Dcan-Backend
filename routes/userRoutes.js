const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getUsers, deleteUser, toggleBlockUser } = require("../controllers/userController");

// All routes protected and admin only
router.get("/", protect, getUsers); // fetch all users
router.delete("/:id", protect, deleteUser); // delete user
router.put("/block/:id", protect, toggleBlockUser); // block/unblock user

module.exports = router;
