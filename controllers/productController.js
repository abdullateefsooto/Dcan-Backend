// const Product = require("../models/Product");
// const asyncHandler = require("../utils/asyncHandler");

// // @desc Create a product
// // @route POST /products
// // @access Private
// const createProduct = asyncHandler(async (req, res) => {
// const { name, description, price, category, countInStock, image } = req.body;

// const product = new Product({
//   name,
//   description,
//   price,
//   category,
//   countInStock,
//   image,
// });


//   const createdProduct = await product.save();
//   res.status(201).json(createdProduct);
// });

// // @desc Get all products
// // @route GET /products
// // @access Public
// const getProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find({});
//   res.json(products);
// });

// // @desc Get single product
// // @route GET products/:id
// // @access Public
// const getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     res.json(product);
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });

// // @desc Update product
// // @route PUT /products/:id
// // @access Private
// const updateProduct = asyncHandler(async (req, res) => {
//   const { name, description, price, category, countInStock } = req.body;
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.category = category || product.category;
//     product.countInStock = countInStock || product.countInStock;

//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });

// // @desc Delete product
// // @route DELETE /products/:id
// // @access Private
// const deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     await product.deleteOne();
//     res.json({ message: "Product removed" });
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });

// module.exports = {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };


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
