const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const cloudinary = require("./config/cloudinary");

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   DATABASE
======================= */
connectDB();
cloudinary;

/* =======================
   MIDDLEWARES
======================= */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://dcan-frontend-project.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (before routes)
const logger = require("./middleware/logger");
app.use(logger);

/* =======================
   ROUTES
======================= */
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoute"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/paystack", require("./routes/paymentRoutes"));

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("✅ DCAN MART is running");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "frontend/dist", "index.html")
    );
  });
}

/* =======================
   ERROR HANDLER
======================= */
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
