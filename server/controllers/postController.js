import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import uploadToCloudinary from "../middleware/cloudinaryMiddleware.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Report from "../models/reportModel.js";
// import { response } from "express";
// import user from "../models/userModel.js";
// import { throws } from "node:assert/strict";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const generateAndPost = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // Check if user has enough credits
    if (user.credits < 1) {
      return res.status(403).json({ message: "Not Enough Credits!" });
    }

    const { prompt, caption } = req.body;
    if (!prompt || !caption) {
      return res.status(400).json({ message: "Kindly Provide A prompt!" });
    }

    // Ensure generated-content directory exists
    const dir = path.join(__dirname, "../generated-content");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // ✅ Was missing

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // ✅ API key was missing

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", //  Wrong model name fixed
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"], //  Was missing
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    let newPost = null;

    for (const part of parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        const filename = crypto.randomUUID() + ".png";
        const filePath = path.join(dir, filename);

        fs.writeFileSync(filePath, buffer);
        const imageLink = await uploadToCloudinary(filePath);
        fs.unlinkSync(filePath);

        if (!imageLink?.secure_url) {
          return res.status(500).json({ message: "Cloudinary Upload Failed!" });
        }

        newPost = await Post.create({ user: userId, imageLink: imageLink.secure_url, prompt: req.body.prompt, caption });
        await newPost.populate("user");

        //  Deduct credits only after successful post creation
        await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });
        break;
      }
    }

    if (!newPost) {
      return res.status(500).json({ message: "No Image Returned From Gemini!" });
    }

    return res.status(201).json(newPost);

  } catch (error) {
    console.error("generateAndPost error:", error.message);
    return res.status(500).json({ message: error.message || "Post Not Created!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Posts Not Found!" });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Post Not Found!" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Post Not Found!" });
  }
};

const likeAndUnlikePost = async (req, res) => {

  let currentUser = await User.findById(req.user._id)

  if (!currentUser) {
    res.status(404)
    throw new Error('User Not Found!')
  }

  const post = await Post.findById(req.params.pid).populate('user')

  if (!post) {
    res.status(404)
    throw new Error("Post Not Found!")
  }
  // Check if Already liked
  if (post.likes.includes(currentUser._id)) {
    // DIslike
    // Add Follower In liked
    let updatedLikesList = post.likes.filter(like => like.toString() !== currentUser._id.toString())
    post.likes = updatedLikesList
    await post.save({ validateBeforeSave: false })
  } else {
    //Like 
    //Add Follower in Liked
    post.likes.push(currentUser._id)
    await post.save({ validateBeforeSave: false })
  }
  // Populate after save using the POst Model directly
  await Post.populate(post, { path: 'likes' })

  res.status(200).json(post)
}

const reportPost = async (req, res) => {

  const { text } = req.body
  const postId = req.params.pid
  const userId = req.user._id  

  if (!text) {
    res.status(409)
    throw new Error("Please Enter Text");

  }

  const newReport = new Report({
    user: userId,
    post: postId,
    text: text
  })

  await newReport.save()
  await newReport.populate('user')
  await newReport.populate('post')


  if (!newReport) {
    res.status(409)
    throw new Error("Unable To Report This Post");

  }
  res.status(201).json(newReport)

}

const postController = { generateAndPost, getPosts, getPost, likeAndUnlikePost, reportPost };

export default postController;


























// const likeAndUnlikePost = async (req, res) => {

//   let currentUser = await User.findById(req.user._id)

//   //Check If User Exists
//   if (!currentUser) {
//     res.status(404)
//     throw new Error("User Not Found");
//   }

//   //Check if posts exist
//   const post = await Post.findById(req.params.pid).populate('user')

//   if (!post) {
//     res.status(404)
//     throw new Error("Post Not Found");
//   }

//   // Check If Already Liked
//   if (post.likes.includes(currentUser._id)) {
//     //Dislike
//     // Remove Follower From Likes
//     let updatedLikesList = post.likes.filter(like => like.toString() !== currentUser._id.toString())
//     post.likes = updatedLikesList
//     await post.save()
//   } else {
//     //LIke
//     // Add Follower in liked
//     post.likes.push(currentUser._id)
//     await post.save()
//   }
//   res.status(200).json(post)}