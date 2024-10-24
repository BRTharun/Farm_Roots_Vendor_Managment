const asyncHandler = require("express-async-handler");
const Product = require("../../model/product/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public (Guest and User)
const getAllProducts = asyncHandler(async (req, res) => {
    const { category, search, tags, priceRange, sortBy, order } = req.query;

    let query = { publish: true };

    if (category) {
        query.category = category;
    }

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (tags) {
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        query.tags = { $in: tagsArray };
    }

    if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        query.regularPrice = { $gte: min, $lte: max };
    }

    let sort = {};
    if (sortBy) {
        sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
        sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
        .sort(sort)
        .populate("vendor", "companyName");

    res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public (Guest and User)
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
        "vendor",
        "companyName"
    );

    if (product && product.publish) {
        // If the user is logged in, track that they viewed the product
        if (req.user) {
            product.viewedBy.push(req.user._id);
            await product.save();
        }

        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

const getProducts = asyncHandler(async (req, res) => {
    res.json(await Product.find());
});

module.exports = {
    getAllProducts,
    getProductById,
    getProducts,
};
