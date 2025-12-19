const express = require("express");
const axios = require("axios");
const router = express.Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// POST /paystack/initialize
router.post("/initialize", async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: "Email and amount are required" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount, // in kobo
        callback_url: "http://localhost:5173/checkout-success" // adjust if you have a success page
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send Paystack data back to frontend
    res.json({ success: true, data: response.data.data });
  } catch (err) {
    console.error("Paystack Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Paystack initialization failed",
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
