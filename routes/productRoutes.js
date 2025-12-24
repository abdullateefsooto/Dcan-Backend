const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

// Routes
router.route("/")
  .get(getProducts)           // Get all products
  .post(protect, createProduct); // Create product with Cloudinary URL

router.route("/:id")
  .get(getProductById)                 // Get single product
  .put(protect, updateProduct)         // Update product
  .delete(protect, deleteProduct);     // Delete product

module.exports = router;

