const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// Create Product (with Cloudinary image URL from frontend)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, countInStock, image } = req.body;

  if (!image) return res.status(400).json({ message: "Image URL is required" });

  const product = new Product({
    name,
    description,
    price,
    category,
    countInStock,
    image, // <- use the Cloudinary URL sent from frontend
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Get Single Product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, countInStock, image } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.countInStock = countInStock || product.countInStock;
  if (image) product.image = image; // <- update image URL if provided

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
