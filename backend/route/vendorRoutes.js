const express = require("express");
const router = express.Router();
const {
    getVendorProfile,
    updateVendorProfile,
    deleteVendorProfile,
    adddProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    getProduct,
    updateProductt,
    deleteProductt,
} = require("../controllers/vendor/vendorController");
const { protect, vendor } = require("../middleware/authMiddleware");
const {
    createCategory,
    createSubcategory,
    createManufacturer,
    getManufacturerById,
    getSubcategoryById,
    getAllManufacturers,
    getAllSubcategories,
    productSubCategoryMap,
    manufactureMap,
    getAllCategories,
    getCategoryById,
    updateCategory,
    updateSubcategory,
    updateSubcategoryProducts,
    updateManufacturer,
    updateManufacturerProducts,
    deleteCategory,
    deleteSubcategory,
    deleteManufacturer,
} = require("../controllers/subController");
const { getProductById } = require("../controllers/product/productController");

// Get vendor profile
router.get("/profile", protect, vendor, getVendorProfile);

// Update vendor profile
router.put("/profile", protect, vendor, updateVendorProfile);

// Delete vendor profile
router.delete("/profile", protect, vendor, deleteVendorProfile);

// Product CRUD operations for Vendor

// Add a new product
router.post("/product", protect, vendor, adddProduct);

router.get("/get-product/:productId", protect, vendor, getProduct);

// Route to update a product
router.put("/product/:productId", protect, vendor, updateProductt);

router.get("/products", protect, vendor, getVendorProducts);

// Update a product
//router.put("/products/:id", protect, vendor, updateProduct);

// Delete a product
router.delete("/product/:productId", protect, vendor, deleteProductt);

// Route to get vendor's products
router.get("/products", protect, vendor, getVendorProducts);

router.post("/category", protect, vendor, createCategory);

router.get("/categorys", protect, vendor, getAllCategories);
router.get("/category/:id", protect, vendor, getCategoryById);
router.put("/category/:id", protect, vendor, updateCategory);

router.delete('/category/:id',protect,vendor,deleteCategory);

router.post("/sub-category/:category_id", protect, vendor, createSubcategory);

router.post(
    "/sub-category-map/:subCategory_id",
    protect,
    vendor,
    productSubCategoryMap
);

router.delete('/sub-category/:id',protect,vendor,deleteSubcategory)

router.post("/manufacturer", protect, vendor, createManufacturer);

router.post("/manufacturer/:manufacturer_id", protect, vendor, manufactureMap);
//router.post("/product/:productId", protect, vendor, getProduct);

// Route to delete a product
router.delete("/product/:productId", protect, vendor, deleteProduct);

router.get("/manufacturer/:id", protect, vendor, getManufacturerById);

// Route to get a subcategory by ID
router.get("/subcategory/:id", protect, vendor, getSubcategoryById);

router.get("/manufacturers", protect, vendor, getAllManufacturers);
router.put("/manufacturer/:id", protect, vendor,updateManufacturer);
router.put("/manufacturer-prod/:id",protect,vendor,updateManufacturerProducts);

router.delete('/manufacturer/:id',protect,vendor,deleteManufacturer);

router.get("/sub-categorys/:id", protect, vendor, getAllSubcategories);

router.put("/sub-category/:id", protect, vendor, updateSubcategory);

router.put('/sub-category-prod/:id',protect,vendor,updateSubcategoryProducts)
module.exports = router;
