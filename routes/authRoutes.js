// // const express = require("express");
// // const router = express.Router();
// // const { registerUser, loginUser } = require("../controllers/authController");
// // const protect = require("../middleware/authMiddleware");
// // //route for the register nd login
// // router.post("/register", registerUser);
// // router.post("/login", loginUser);

// // //route for the protected route
// // //and give the details about the user
// // router.get("/me", protect, (req, res) => {
// //   res.json({ message: `Welcome ${req.user.name}` });
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const { registerUser, loginUser } = require("../controllers/authController");
// const protect = require("../middleware/authMiddleware");

// // ✅ Register user
// router.post("/register", registerUser);

// // ✅ Login user
// router.post("/login", loginUser);

// // ✅ Protected route (for logged-in users)
// router.get("/me", protect, (req, res) => {
//   res.json({ message: `Welcome ${req.user.name}` });
// });

// // ✅ Create Admin Account (temporary route for setup)
// router.post("/create-admin", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if admin already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create admin user
//     const admin = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });

//     await admin.save();
//     res.status(201).json({ message: "✅ Admin account created successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "❌ Server error while creating admin" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// register & login
router.post("/register", registerUser);
router.post("/login", loginUser);

// protected test route
router.get("/me", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
});

// (optional) create first admin manually
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashedPassword, role: "admin" });
    await admin.save();
    res.status(201).json({ message: "✅ Admin account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Server error while creating admin" });
  }
});

module.exports = router;

