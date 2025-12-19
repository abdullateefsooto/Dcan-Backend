// const User = require("../models/User");
// const generateToken = require("../utils/generateToken");
// const bcrypt = require("bcryptjs");
// const asyncHandler = require("../utils/asyncHandler");

// // REGISTER USER (accept role)
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role } = req.body;

//   if (!name || !email || !password)
//     return res.status(400).json({ message: "All fields are required" });

//   const existingUser = await User.findOne({ email });
//   if (existingUser)
//     return res.status(400).json({ message: "User already exists" });

//   // ✅ Only allow admin if explicitly sent
//   const user = await User.create({
//     name,
//     email,
//     password,
//     role: role === "admin" ? "admin" : "user",
//   });

//   res.status(201).json({
//     success: true,
//     token: generateToken(user._id),
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });

// // LOGIN USER
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   console.log("LOGIN BODY:", req.body);

//   if (!email || !password)
//     return res.status(400).json({ message: "Please provide email and password" });

//   const user = await User.findOne({ email });
//   if (!user)
//     return res.status(400).json({ message: "Invalid credentials" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch)
//     return res.status(400).json({ message: "Invalid credentials" });

//   res.json({
//     success: true,
//     token: generateToken(user._id),
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });

// module.exports = {
//   registerUser,
//   loginUser,
// };






const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");

// REGISTER USER (accept role)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // Only allow admin if explicitly sent
  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "user",
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

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Please provide email and password" });

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  // BLOCKED USER CHECK
  if (user.blocked)
    return res.status(403).json({ message: "Your account is blocked." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

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
