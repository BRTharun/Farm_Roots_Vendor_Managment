const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        phone: {
            type: String,
        },
        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
            },
        ],
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
    },
    {
        timestamps: true,
    }
);

const Guest = mongoose.model("Guest", guestSchema);
module.exports = Guest;
