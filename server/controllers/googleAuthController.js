import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const GenerateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// POST /api/auth/google
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists (by email or googleId)
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        const isNewUser = !user;

        if (!user) {
            // Create new user with Google data
            user = await User.create({
                name,
                email,
                googleId,
                Avatar: picture || "",
                bio: "Hey, I'm on SocialiX! ✨",
                isAdmin: false,
                isActive: true,
                credits: 5,
            });
        } else if (!user.googleId) {
            // Link Google account to existing email user
            user.googleId = googleId;
            if (!user.Avatar && picture) {
                user.Avatar = picture;
            }
            await user.save({ validateBeforeSave: false });
        }

        // Send welcome email for new users
        if (isNewUser) {
            sendWelcomeEmail(email, name).catch(() => {});
        }

        return res.status(200).json({
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio || "",
            phone: user.phone || null,
            Avatar: user.Avatar || "",
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            credits: user.credits,
            isNewUser,
            token: GenerateToken(user._id),
        });
    } catch (error) {
        console.error("Google login error:", error);
        return res.status(401).json({ message: "Invalid Google credential" });
    }
};

export default { googleLogin };
