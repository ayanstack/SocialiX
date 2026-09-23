import express from "express"
import multer from "multer"
import protect from "../middleware/authMiddleware.js"
import postController from "../controllers/postController.js"

import savePostController from "../controllers/savePostController.js"
import commentController from "../controllers/commentController.js"

const router = express.Router({ mergeParams: true })
const upload = multer({ dest: "uploads/" })

router.get("/", protect.forUser, postController.getPosts)
router.post("/", protect.forUser, postController.generateAndPost)
router.post("/create", protect.forUser, upload.single("image"), postController.createDirectPost)
router.get("/:pid", protect.forUser, postController.getPost)
router.put("/:pid", protect.forUser, postController.likeAndUnlikePost)
router.post("/:pid", protect.forUser, postController.reportPost)

// Save Post Routes
router.post("/:pid/save", protect.forUser, savePostController.savePost)

// Comment Post Routes
router.get("/:pid/comments", protect.forUser, commentController.getComments)
router.post("/:pid/comments", protect.forUser, commentController.addComment)
router.delete("/:pid/comments/:cid", protect.forUser, commentController.removeComment)


export default router




