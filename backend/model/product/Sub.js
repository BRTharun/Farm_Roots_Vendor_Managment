const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subcategories: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    ],
    product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const SubcategorySchema = new mongoose.Schema({
    name: { type: String, required: false },
    category_ids:[{type:mongoose.Schema.Types.ObjectId, ref:"Category"}],
    product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const ManufacturerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    product_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Category = mongoose.model("Category", CategorySchema);
const Subcategory = mongoose.model("Subcategory", SubcategorySchema);
const Manufacturer = mongoose.model("Manufacturer", ManufacturerSchema);

module.exports = { Category, Subcategory, Manufacturer };
