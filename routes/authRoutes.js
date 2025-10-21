const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
//route for the register nd login
router.post("/register", registerUser);
router.post("/login", loginUser);

//route for the protected route
//and give the details about the user
router.get("/me", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
});

module.exports = router;
