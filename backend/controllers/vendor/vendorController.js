const asyncHandler = require("express-async-handler");
const Vendor = require("../../model/vendor/Vendor");
const Product = require("../../model/product/Product");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
// @access  Private (Vendor)

const getVendorProfile = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.user._id).select("-password");

    if (vendor) {
        res.json(vendor);
    } else {
        res.status(404);
        throw new Error("Vendor not found");
    }
});

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
// @access  Private (Vendor)
const updateVendorProfile = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.user._id);

    if (vendor) {
        vendor.companyName = req.body.companyName || vendor.companyName;
        vendor.contactName = req.body.contactName || vendor.contactName;
        vendor.email = req.body.email || vendor.email;
        vendor.phone = req.body.phone || vendor.phone;
        vendor.address = req.body.address || vendor.address;
        vendor.bio = req.body.bio || vendor.bio;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            vendor.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedVendor = await vendor.save();

        res.json({
            _id: updatedVendor._id,
            companyName: updatedVendor.companyName,
            contactName: updatedVendor.contactName,
            email: updatedVendor.email,
            phone: updatedVendor.phone,
            address: updatedVendor.address,
            bio: updatedVendor.bio,
            profilePhoto: updatedVendor.profilePhoto,
            isVerified: updatedVendor.isVerified,
            role: updatedVendor.role,
            // other fields as needed
        });
    } else {
        res.status(404);
        throw new Error("Vendor not found");
    }
});

// @desc    Delete vendor profile
// @route   DELETE /api/vendors/profile
// @access  Private (Vendor)
const deleteVendorProfile = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findById(req.user._id);

    if (vendor) {
        // Optionally, remove all products associated with the vendor
        await Product.deleteMany({ vendor: vendor._id });

        await vendor.remove();
        res.json({ message: "Vendor removed" });
    } else {
        res.status(404);
        throw new Error("Vendor not found");
    }
});

// @desc    Add a new product
// @route   POST /api/vendors/products
// @access  Private (Vendor)
const addProduct = asyncHandler(async (req, res) => {
    const {
        name,
        category,
        image,
        description,
        stock,
        tags,
        regularPrice,
        salePrice,
        publish,
    } = req.body;

    if (!name || !category || !description || !regularPrice) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const product = new Product({
        name,
        category,
        image,
        description,
        stock,
        tags,
        regularPrice,
        salePrice,
        publish,
        vendor: req.user._id, // Assuming you add a vendor field in Product schema
    });

    const createdProduct = await product.save();

    // Add product to vendor's products array
    req.user.products.push(createdProduct._id);
    await req.user.save();

    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/vendors/products/:id
// @access  Private (Vendor)
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Check if the product belongs to the vendor
        if (product.vendor.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Not authorized to update this product");
        }

        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.image = req.body.image || product.image;
        product.description = req.body.description || product.description;
        product.stock =
            req.body.stock !== undefined ? req.body.stock : product.stock;
        product.tags = req.body.tags || product.tags;
        product.regularPrice = req.body.regularPrice || product.regularPrice;
        product.salePrice =
            req.body.salePrice !== undefined
                ? req.body.salePrice
                : product.salePrice;
        product.publish =
            req.body.publish !== undefined ? req.body.publish : product.publish;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Delete a product
// @route   DELETE /api/vendors/products/:id
// @access  Private (Vendor)
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Check if the product belongs to the vendor
        if (product.vendor.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Not authorized to delete this product");
        }

        await Product.findByIdAndDelete(req.params.id);

        // Remove product from vendor's products array
        const vendor = await Vendor.findById(req.user._id);
        vendor.products = vendor.products.filter(
            (prodId) => prodId.toString() !== req.params.id
        );
        await vendor.save();

        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Get vendor's products
// @route   GET /api/vendors/products
// @access  Private (Vendor)
const getVendorProducts = asyncHandler(async (req, res) => {
    console.log(req.user._id);
    const vendor = await Vendor.findById(req.user._id).populate("products");
    console.log(vendor);

    if (vendor) {
        res.json(vendor.products);
    } else {
        res.status(404);
        throw new Error("Vendor not found");
    }
});

const Productt = require("../../model/product/Product");
const {
    Category,
    Subcategory,
    Manufacturer,
} = require("../../model/product/Sub");

const adddProduct = async (req, res) => {
    try {
        const {
            product_type,
            published,
            product_name,
            short_description,
            full_description,
            product_condition,
            country_of_origin,
            product_tags,
            available_start_date,
            available_end_date,
            delivery_time,
            free_shipping,
            additional_shipping_charge,
            quantity_unit,
            inventory,
            price,
            disable_buy_button,
            base_price_calculation,
            image,
        } = req.body;

        console.log(req.body);
        // Check if Manufacturer, Category, and Subcategory exist
        // const manufacturerObj = await Manufacturer.findOne({
        //     name: manufacturer,
        // });
        // const categoryObj = await Category.findOne({ name: category });
        // const subcategoryObj = await Subcategory.findOne({ name: subcategory });

        // if (!manufacturerObj || !categoryObj || !subcategoryObj) {
        //     return res.status(400).json({
        //         message: "Invalid manufacturer, category, or subcategory",
        //     });
        // }

        // Create new product
        const newProduct = new Productt({
            product_id: new mongoose.Types.ObjectId(),
            product_type,
            published,
            product_name,
            short_description,
            full_description,
            product_condition,
            country_of_origin,
            product_tags,
            available_start_date,
            available_end_date,
            delivery_time,
            free_shipping,
            additional_shipping_charge,
            quantity_unit,
            inventory,
            price,
            disable_buy_button,
            base_price_calculation,
            image,
        });
        console.log("kjdfkld", newProduct);
        // Save the product
        const createdProductt = await newProduct.save();

        req.user.products.push(createdProductt._id);
        await req.user.save();

        // Update manufacturer, category, and subcategory with the new product ID
        // manufacturerObj.product_ids.push(newProduct._id);
        // await manufacturerObj.save();

        // categoryObj.product_ids.push(newProduct._id);
        // await categoryObj.save();

        // subcategoryObj.product_ids.push(newProduct._id);
        // await subcategoryObj.save();

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product by ID
        const product = await Productt.findById(productId)
            .populate("manufacturer")
            .populate("category")
            .populate("subcategory");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const updateProductt = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;

        // Find and update the product
        const product = await Productt.findByIdAndUpdate(
            productId,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("manufacturer")
            .populate("category")
            .populate("subcategory");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteProductt = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find and delete the product
        const product = await Productt.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Optionally, you can also remove product references from Manufacturer, Category, and Subcategory
        // ...

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    getVendorProfile,
    updateVendorProfile,
    deleteVendorProfile,
    addProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    adddProduct,
    getProduct,
    updateProductt,
    deleteProductt,
};
