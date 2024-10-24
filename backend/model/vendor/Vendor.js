const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const vendorSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, "Company name is required"],
        },
        contactName: {
            type: String,
            required: [true, "Contact name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        role:{
            type:String,
            default:"Vendor"
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        profilePhoto: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
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
        accountVerificationToken: String,
        accountVerificationTokenExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
vendorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
vendorSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Account verification token creation
vendorSchema.methods.createAccountVerificationToken = async function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.accountVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
    return verificationToken;
};

// Password reset token creation
vendorSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
};

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
