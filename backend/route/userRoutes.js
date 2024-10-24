const express = require("express");
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
} = require("../controllers/users/userController");
const { protect, userRole } = require("../middleware/authMiddleware");

// Get user profile
router.get("/profile", protect, userRole, getUserProfile);

// Update user profile
router.put("/profile", protect, userRole, updateUserProfile);

// Delete user profile
router.delete("/profile", protect, userRole, deleteUserProfile);

module.exports = router;
