const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        profilePhoto: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
        isAccountVerified: {
            type: Boolean,
            default: false,
        },
        accountVerificationToken: String,
        accountVerificationTokenExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Account verification token creation
userSchema.methods.createAccountVerificationToken = async function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.accountVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
    return verificationToken;
};

// Password reset token creation
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
