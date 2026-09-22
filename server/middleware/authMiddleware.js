import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const forUser = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: "No Token Found" })
            }
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            let user = await User.findById(decoded.id)
            if (!user) {
                return res.status(401).json({ message: "User not found!" })
            }
            req.user = user
            next()
        } else {
            return res.status(401).json({ message: "No Token Found" })
        }
    } catch (error) {
        return res.status(401).json({ message: "UnAuthorised access!" })
    }   
}

const forAdmin = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1]
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: "No Token Found" })
            }
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            let user = await User.findById(decoded.id)
            if (!user || !user.isAdmin) {
                return res.status(401).json({ message: "UnAuthorised access! Admin Only" })
            }
            req.user = user
            next()
        } else {
            return res.status(401).json({ message: "No Token Found" })
        }
    } catch (error) {
        return res.status(401).json({ message: "UnAuthorised access!" })
    }
}

const protect = { forUser, forAdmin }

export default protect