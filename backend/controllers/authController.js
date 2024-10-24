// authController.js
const asyncHandler = require("express-async-handler");
const User = require("../model/user/User");
const Vendor = require("../model/vendor/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.isPasswordMatched(password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// Register Vendor
const registerVendor = asyncHandler(async (req, res) => {
    const { companyName, contactName, email, password, phone } = req.body;

    const vendorExists = await Vendor.findOne({ email });

    if (vendorExists) {
        res.status(400);
        throw new Error("Vendor already exists");
    }

    const vendor = await Vendor.create({
        companyName,
        contactName,
        email,
        password,
        phone,
    });

    if (vendor) {
        res.status(201).json({
            _id: vendor._id,
            companyName: vendor.companyName,
            contactName: vendor.contactName,
            email: vendor.email,
            token: generateToken(vendor._id, vendor.role),
        });
    } else {
        res.status(400);
        throw new Error("Invalid vendor data");
    }
});

// Login Vendor
const loginVendor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });

    if (vendor && (await vendor.isPasswordMatched(password))) {
        res.json({
            _id: vendor._id,
            companyName: vendor.companyName,
            contactName: vendor.contactName,
            email: vendor.email,
            role: vendor.role,
            token: generateToken(vendor._id, vendor.role),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Logout User
// @route   POST /api/auth/logout/user
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    // Normally, you would handle JWT invalidation here.
    // For this example, we'll assume that simply removing the token from the client-side is sufficient.
    res.status(200).json({
        message: "User logged out successfully",
    });
});

// @desc    Logout Vendor
// @route   POST /api/auth/logout/vendor
// @access  Private
const logoutVendor = asyncHandler(async (req, res) => {
    // Normally, you would handle JWT invalidation here.
    // For this example, we'll assume that simply removing the token from the client-side is sufficient.
    res.status(200).json({
        message: "Vendor logged out successfully",
    });
});

module.exports = {
    registerUser,
    loginUser,
    registerVendor,
    loginVendor,
    logoutUser,
    logoutVendor,
};
