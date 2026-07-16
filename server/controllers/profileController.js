import User from "../models/userModel.js"

const getMyFollowers = async (req, res) => {

    const user = await User.findById(req.user.id).populate('followers')

    if (!user) {
        res.status(404)
        throw new Error("User Not Found!");
    }
    res.status(200).json(user.followers)

}
const getMyFollowings = async (req, res) => {

    const user = await User.findById(req.user.id).populate('following')

    if (!user) {
        res.status(404)
        throw new Error("User Not Found!");
    }
    res.status(200).json(user.following)
}

const profileController = { getMyFollowers, getMyFollowings }

export default profileController