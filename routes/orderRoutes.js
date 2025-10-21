const express = require("express");
const router = express.Router();

// Import order controller functions
const {  createOrder,  getMyOrders,  getOrderById,  updateOrderStatus,  deleteOrder } = require("../controllers/orderController");

// Import authentication middleware to protect private routes
const protect = require("../middleware/authMiddleware");

/* ============================================================================
   @route   POST /orders
   @desc    Create a new order
   @access  Private (Logged-in users only)
   ----------------------------------------------------------------------------
   @route   GET /orders
   @desc    Get all orders belonging to the logged-in user
   @access  Private
   ============================================================================
*/
router.route("/")
  .post(protect, createOrder)  // Create a new order
  .get(protect, getMyOrders);  // Get all orders for the logged-in user

/* ============================================================================
   @route   GET /orders/:id
   @desc    Get a single order by its ID
   @access  Private (User must be logged in)
   ----------------------------------------------------------------------------
   @route   PUT /orders/:id
   @desc    Update the status of an order (e.g., Pending → Shipped)
   @access  Private
   ----------------------------------------------------------------------------
   @route   DELETE /orders/:id
   @desc    Delete an order (User or Admin can delete)
   @access  Private
   ============================================================================
*/
router.route("/:id")
  .get(protect, getOrderById)      // Get one order by ID
  .put(protect, updateOrderStatus) // Update order status
  .delete(protect, deleteOrder);   // Delete an order

module.exports = router;
