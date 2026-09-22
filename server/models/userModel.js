import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your email"],
        unique: true
    },
    phone: {
        type: Number,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    googleId: {
        type: String,
        default: null,
    },
    Avatar: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    credits: {
        type: Number,
        default: 5,
        required: true
    },
}, {
    timestamps: true
})

const user = mongoose.model('User', userSchema)

export default user