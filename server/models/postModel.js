import { Type } from "@google/genai"
import mongoose from "mongoose"
const postSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    isPublished: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', postSchema)

export default Post
