// authRoutes.js
const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    registerVendor,
    loginVendor,
    logoutUser,
    logoutVendor,
} = require("../controllers/authController");

// User Registration and Login
router.post("/register/user", registerUser)
router.post("/login/user", loginUser);


// Vendor Registration and Login
router.post("/register/vendor", registerVendor);
router.post("/login/vendor", loginVendor);


// User Logout
router.post('/logout/user', logoutUser);

// Vendor Logout
router.post('/logout/vendor', logoutVendor);



module.exports = router;
