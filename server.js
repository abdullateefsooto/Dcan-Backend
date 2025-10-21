const express = require("express");     
require("dotenv").config();            
const cors = require("cors");           // Allows cross-origin requests (frontend ↔ backend)
const PORT = process.env.PORT || 3000;  

const app = express();

// ======== MIDDLEWARES ======== //

// Enable CORS so frontend apps can communicate with this backend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ======== DATABASE CONNECTION ======== //
const connectDB = require("./config/db");  // Import the MongoDB connection function
connectDB();                               // Call it to connect to MongoDB

// ======== ROUTES ======== //

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

// Start the Express server and listen port 3000
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
