const jwt = require("jsonwebtoken");
const User = require("../model/user/User");
const Vendor = require("../model/vendor/Vendor");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if the user is a Vendor or a User
            let user = await User.findById(decoded.id);
            if (!user) {
                user = await Vendor.findById(decoded.id);
                if (!user) {
                    res.status(401);
                    throw new Error("Not authorized, user not found");
                }
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// Authorization for Admin Users
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as an admin");
    }
};

// Authorization for Vendors
const vendor = (req, res, next) => {
    if (req.user && req.user instanceof Vendor) {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as a vendor");
    }
};

// Authorization for Regular Users
const userRole = (req, res, next) => {
    if (req.user && req.user.role === "User") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as a user");
    }
};

module.exports = { protect, admin, vendor, userRole };
