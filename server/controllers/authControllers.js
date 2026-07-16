import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"



const registerUser = async (req, res) => {

    const { name, email, phone, password, bio } = req.body || {}


    //check if all field are coming 
    if (!name || !email || !phone || !password || !bio) {
        return res.status(409).json({ message: "Please fill all details!" })
    }


    //check if user already exists
    let emailExist = await User.findOne({ email: email })
    let phoneExist = await User.findOne({ phone: phone })

    if (emailExist || phoneExist) {
        res.status(409)
        throw new Error("User Already Exists")
    }

    //Hash Password

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);


    //Register User 
    let user = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        bio,
    })

    if (!user) {
        res.status(400)
        throw new Error("User Not Created")
    }
    res.status(201).json({
        id: user._id,
        name: user.name, 
        bio: user.bio,
        phone: user.phone,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        credits: user.credits,
        token: GenerateToken(user._id)
    })

    console.log(user)
}

const loginUser = async (req, res) => {

    const { email, password } = req.body

    //check if all field are coming 
    if (!email || !password) {
        return res.status(409)
        throw new Error("Please fill all details!");

    }

    //check if user user exists
    let user = await User.findOne({ email: email })

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            credits: user.credits,
            token: GenerateToken(user._id)

        })
    } else {
        res.status(400)
        throw new Error("Invalid Credentials!")
    }
}

//Protected Controller
const privateController = (req, res) => {
    res.send("I am private Controller " + req.user.name)
}

// Generate Token 
const GenerateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const authController = { registerUser, loginUser, privateController }

export default authController