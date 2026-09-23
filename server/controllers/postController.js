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
    const userId = req.user._id || req.user.id;

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
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Kindly Provide A prompt!" });
    }

    let finalImageUrl = null;

    // 1. Attempt Gemini / Imagen if GEMINI_API_KEY is provided
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY") {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const dir = path.join(__dirname, "../generated-content");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Attempt generateImages (Imagen 3)
        const response = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
          },
        });

        if (response?.generatedImages?.[0]?.image?.imageBytes) {
          const buffer = Buffer.from(response.generatedImages[0].image.imageBytes, "base64");
          const filename = crypto.randomUUID() + ".jpg";
          const filePath = path.join(dir, filename);

          fs.writeFileSync(filePath, buffer);
          const imageLink = await uploadToCloudinary(filePath);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

          if (imageLink?.secure_url) {
            finalImageUrl = imageLink.secure_url;
          }
        }
      } catch (geminiError) {
        console.warn("Gemini generation warning:", geminiError?.message || geminiError);
      }
    }

    // 2. Fallback to Pollinations AI (High quality, keyless AI image generation)
    if (!finalImageUrl) {
      try {
        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(prompt.trim());
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

        const cloudRes = await uploadToCloudinary(pollinationsUrl);
        if (cloudRes?.secure_url) {
          finalImageUrl = cloudRes.secure_url;
        } else {
          finalImageUrl = pollinationsUrl;
        }
      } catch (pollinationErr) {
        console.error("Pollinations fallback error:", pollinationErr);
      }
    }

    if (!finalImageUrl) {
      return res.status(500).json({ message: "Failed to generate image. Please try again!" });
    }

    const postCaption = caption || prompt;
    const newPost = await Post.create({
      user: userId,
      imageLink: finalImageUrl,
      prompt: prompt.trim(),
      caption: postCaption,
    });

    await newPost.populate("user", "name Avatar bio email _id");

    // Deduct credit after successful post creation
    await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });

    return res.status(201).json(newPost);

  } catch (error) {
    console.error("generateAndPost error:", error.stack || error.message);
    return res.status(500).json({ message: error.message || "Post Not Created!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate("user", "name Avatar bio email _id")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(posts);
  } catch (error) {
    console.error("getPosts error:", error.stack || error.message);
    return res.status(500).json({ message: error.message || "Posts Not Found!" });
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
    console.error("getPost error:", error);
    return res.status(500).json({ message: error.message || "Post Not Found!" });
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
  if (post.likes.some(like => like.toString() === currentUser._id.toString())) {
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

const createDirectPost = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { prompt, caption, imageLink } = req.body;
    let finalImageUrl = imageLink || "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      if (uploadResult?.secure_url) {
        finalImageUrl = uploadResult.secure_url;
      }
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: "Please upload an image or provide an image link!" });
    }

    const newPost = await Post.create({
      user: userId,
      imageLink: finalImageUrl,
      prompt: prompt || caption || "Custom Post",
      caption: caption || prompt || "",
    });

    await newPost.populate("user", "name Avatar bio email _id");
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("createDirectPost error:", error);
    return res.status(500).json({ message: error.message || "Failed to create post" });
  }
};

const postController = { generateAndPost, createDirectPost, getPosts, getPost, likeAndUnlikePost, reportPost };

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