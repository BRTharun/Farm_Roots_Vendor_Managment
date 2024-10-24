const asyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const bcrypt = require("bcryptjs");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User)

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            bio: updatedUser.bio,
            profilePhoto: updatedUser.profilePhoto,
            isAdmin: updatedUser.isAdmin,
            role: updatedUser.role,
            // other fields as needed
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private (User)
const deleteUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await User.findByIdAndDelete(user);
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};
