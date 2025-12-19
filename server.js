const express = require("express");     
require("dotenv").config();            
const cors = require("cors");           // Allows cross-origin requests (frontend ↔ backend)
const PORT = process.env.PORT || 5000;  
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ======== STRIPE PAYMENT INTENT ROUTE ======== //
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body; // amount in cents
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // or "ngn" for Nigerian Naira
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ======== MIDDLEWARES ======== //

// Enable CORS so frontend apps can communicate with this backend
app.use(cors({
    origin: "http://localhost:5173",  // Adjust this to your frontend's URL
    credentials: true,
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
