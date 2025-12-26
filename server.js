const express = require("express");     
require("dotenv").config();            
const cors = require("cors");           // Allows cross-origin requests (frontend ↔ backend)
const PORT = process.env.PORT || 5000;  
const app = express();
const path = require("path");





// Serve static files
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Catch ALL routes and return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// ======== MIDDLEWARES ======== //
// Enable CORS so frontend apps can communicate with this backend
app.use(cors({
  origin: ['http://localhost:5173', 'https://dcan-frontend-project.vercel.app']
}));

// Parse incoming JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======== DATABASE CONNECTION ======== //
const connectDB = require("./config/db");  // Import the MongoDB connection function
connectDB();                               // Call it to connect to MongoDB

const cloudinary = require("./config/cloudinary"); // Import Cloudinary config
cloudinary; // Initialize Cloudinary (if needed elsewhere)


const paymentRoutes = require("./routes/paymentRoutes");
app.use("/paystack", paymentRoutes);

// ======== ROUTES ======== //

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes); // add this line

const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);


// Import and use authentication routes (e.g., register, login)
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);  // All routes in authRoutes will be prefixed with /auth

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);


// Default route to test the server
app.get("/", (req, res) => {
    res.send("Dcan Mart!!!");
});

// ======== CUSTOM MIDDLEWARES ======== //

// Import and use a custom logger middleware (for logging requests)
const logger = require("./middleware/logger");
app.use(logger);

// Import and use the global error handler middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// ======== START SERVER ======== //

// Start the Express server and listen port 5000
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
