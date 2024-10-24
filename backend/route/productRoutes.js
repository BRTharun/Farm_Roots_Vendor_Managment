const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getProducts,
    // Additional routes if needed
} = require("../controllers/product/productController");
const { protect, userRole } = require("../middleware/authMiddleware");

// Get all products (accessible by guests and users)
router.get("/", getProducts);

// Get a single product by ID (accessible by guests and users)
router.get("/:id", getProductById);

module.exports = router;
