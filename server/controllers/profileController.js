import User from "../models/userModel.js";
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js";
import fs from "node:fs";

const getMyFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("followers");
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyFollowings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("following");
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/profile/me
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -googleId");
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/profile/update
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        const { name, bio } = req.body;

        // Update text fields
        if (name && name.trim()) user.name = name.trim();
        if (bio !== undefined) user.bio = bio.trim();

        // Handle avatar upload
        if (req.file) {
            const filePath = req.file.path;
            try {
                const result = await uploadToCloudinary(filePath);
                if (result && result.secure_url) {
                    user.Avatar = result.secure_url;
                }
            } finally {
                // Clean up temp file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            phone: user.phone,
            Avatar: user.Avatar || "",
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            credits: user.credits,
        });
    } catch (error) {
        console.error("updateProfile error:", error);
        return res.status(500).json({ message: error.message });
    }
};

const profileController = { getMyFollowers, getMyFollowings, getMyProfile, updateProfile };

export default profileController;