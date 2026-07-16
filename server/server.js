import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/dbConfig.js"

// Local Imports
import authRoutes from "./routes/authRoutes.js"
import followRoutes from "./routes/followRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import profileRoutes from "./routes/profileRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import savedPostRoutes from "./routes/savedPostRoutes.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Body Parsers (routes se pehle)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ DB Connection (simple call)
connectDB()

// Auth Routes
app.use("/api/auth", authRoutes)

//Follow Routes
app.use("/api/user", followRoutes)

// Profile Router
app.use("/api/profile", profileRoutes)

// Admin Routes
app.use("/api/admin", adminRoutes)

// Post Routes
app.use("/api/posts", postRoutes)

// Saved Posts
app.use("/api/saved-posts" ,savedPostRoutes )

//Error Handler
app.use(errorHandler)

// ✅ Serve Frontend (client/dist)
const clientDistPath = path.join(__dirname, "..", "client", "dist")
app.use(express.static(clientDistPath))

// ✅ Catch-all: send index.html for client-side routing (SPA)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"))
})

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue.black)
})