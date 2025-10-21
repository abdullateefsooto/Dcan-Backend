const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

/* ============================================================================
   @desc    Create a new order
   @route   POST /orders
   @access  Private (User must be logged in)
   ============================================================================
*/
const createOrder = asyncHandler(async (req, res) => {
  // Destructure required fields from the request body
  const { orderItems, totalPrice, address } = req.body;

  // Validation: make sure orderItems exist and is not empty
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Create a new order linked to the currently logged-in user
  const order = new Order({
    user: req.user._id, // From authMiddleware
    orderItems,
    totalPrice,
    address,
  });

  // Save the order to the database
  const createdOrder = await order.save();

  // Respond with the newly created order
  res.status(201).json(createdOrder);
});

/* ============================================================================
   @desc    Get all orders for the currently logged-in user
   @route   GET /orders
   @access  Private
   ============================================================================
*/
const getMyOrders = asyncHandler(async (req, res) => {
  // Find all orders that belong to this user
  // Use populate() to include product details for each item
  const orders = await Order.find({ user: req.user._id }).populate("orderItems.product");

  // Respond with all orders for this user
  res.json(orders);
});

/* ============================================================================
   @desc    Get a single order by its ID
   @route   GET /orders/:id
   @access  Private
   ============================================================================
*/
const getOrderById = asyncHandler(async (req, res) => {
  // Find the order by its unique ID
  const order = await Order.findById(req.params.id).populate("orderItems.product");

  if (order) {
    // If found, return the order details
    res.json(order);
  } else {
    // If not found, throw an error
    res.status(404);
    throw new Error("Order not found");
  }
});

/* ============================================================================
   @desc    Update the order status (e.g. Pending → Shipped → Delivered)
   @route   PUT /orders/:id
   @access  Private (Only logged-in user or admin can update)
   ============================================================================
*/
const updateOrderStatus = asyncHandler(async (req, res) => {
  // Find the order by ID
  const order = await Order.findById(req.params.id);

  if (order) {
    // Update the order status (default to existing status if not provided)
    order.status = req.body.status || order.status;

    // Save the updated order
    const updatedOrder = await order.save();

    // Respond with the updated order
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});


/* ============================================================================
   @desc    Delete an order
   @route   DELETE /api/orders/:id
   @access  Private (User or Admin)
   ============================================================================
*/
const deleteOrder = asyncHandler(async (req, res) => {
  // Find the order by ID
  const order = await Order.findById(req.params.id);

  if (order) {
    // Only allow the user who created the order or an admin to delete it
    if (order.user.toString() === req.user._id.toString() || req.user.isAdmin) {
      await order.deleteOne(); // delete the order from DB
      res.json({ message: "Order deleted successfully" });
    } else {
      res.status(403);
      throw new Error("Not authorized to delete this order");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

/* ============================================================================
   Export all controller functions so they can be used in routes
   ============================================================================
*/
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
