const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    stock_quantity: { type: Number, required: true },
    minimum_cart_quantity: { type: Number, required: true, min: 1 },
    maximum_cart_quantity: { type: Number, required: true, max: 100000 },
    quantity_step: { type: Number, required: true, min: 1 },
});

const PriceSchema = new mongoose.Schema({
    sale_price: { type: Number, required: true },
    mr_price: { type: Number, required: true },
    special_price: { type: Number, optional: true },
    special_price_from: { type: Date, optional: true },
    special_price_to: { type: Date, optional: true },
    product_cost: { type: Number, required: true },
});

const ImageSchema = new mongoose.Schema({
    main_image_for_main_page: { type: String, optional: true },
    product_image_for_product_page: { type: String, optional: true },
});

const ProductSchema = new mongoose.Schema({
    product_id: { type: String, unique: true, required: true },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    product_page_url: { type: String, optional: true },
    product_type: {
        type: String,
        enum: ["Simple Product", "Bundled Product"],
        required: true,
    },
    published: { type: Boolean, required: true },
    product_name: { type: String, required: true, maxlength: 100 },
    short_description: { type: String, required: true, maxlength: 500 },
    full_description: { type: String, optional: true },
    product_condition: {
        type: String,
        enum: ["New", "Used", "Refurbished"],
        required: true,
    },
    country_of_origin: { type: String, optional: true },
    product_tags: [{ type: String }],
    available_start_date: { type: Date, optional: true },
    available_end_date: { type: Date, optional: true },
    delivery_time: { type: Number, optional: true },
    free_shipping: { type: Boolean, optional: true },
    additional_shipping_charge: { type: Number, optional: true },
    quantity_unit: {
        type: String,
        enum: ["gms", "ml", "piece"],
        optional: true,
    },
    inventory: { type: InventorySchema, required: true },
    price: { type: PriceSchema, required: true },
    disable_buy_button: { type: Boolean, required: true },
    base_price_calculation: {
        type: String,
        enum: ["gms", "ml", "piece"],
        optional: true,
    },
    image: { type: ImageSchema, optional: true },
    manufacturer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",
        required:false
    }],
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false,
        },
    ],
    subcategory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required:false,
        },
    ],
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
