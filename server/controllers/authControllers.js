import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

const registerUser = async (req, res) => {
    const { name, email, phone, password, bio } = req.body || {};

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "Please fill all details!" });
    }

    let emailExist = await User.findOne({ email });
    let phoneExist = phone ? await User.findOne({ phone }) : null;

    if (emailExist || phoneExist) {
        return res.status(409).json({ message: "User Already Exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    let user = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        bio: bio || "",
    });

    if (!user) {
        return res.status(400).json({ message: "User Not Created" });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(() => {});

    return res.status(201).json({
        id: user._id,
        _id: user._id,
        name: user.name,
        bio: user.bio,
        phone: user.phone,
        email: user.email,
        Avatar: user.Avatar || "",
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        credits: user.credits,
        token: GenerateToken(user._id),
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all details!" });
    }

    let user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
            id: user._id,
            _id: user._id,
            name: user.name,
            bio: user.bio,
            email: user.email,
            phone: user.phone,
            Avatar: user.Avatar || "",
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            credits: user.credits,
            token: GenerateToken(user._id),
        });
    } else if (user && !user.password) {
        // Google-only user trying to login with password
        return res.status(400).json({ message: "This account uses Google Sign-In. Please use 'Continue with Google'." });
    } else {
        return res.status(400).json({ message: "Invalid Credentials!" });
    }
};

const privateController = (req, res) => {
    res.send("I am private Controller " + req.user.name);
};

const GenerateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const authController = { registerUser, loginUser, privateController };

export default authController;