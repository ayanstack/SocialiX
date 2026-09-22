import User from "../models/userModel.js"
import { sendFollowNotificationEmail } from "../utils/emailService.js"

const followUserRequest = async (req, res) => {
    let targetUser = await User.findById(req.params.uid).select("-password")
    let currentUser = await User.findById(req.user._id)

    //Check If Both User Exists
    if (!targetUser || !currentUser) {
        return res.status(404).json({ message: "User Not Found" })
    }

    // Check If Already Followed
    if (targetUser.followers.some(f => f.toString() === currentUser._id.toString())) {
        return res.status(409).json({ message: "Already Followed!" })
    }
    // Add Follower 
    targetUser.followers.push(currentUser._id)
    await targetUser.save()

    // Add Following 
    currentUser.following.push(targetUser._id)
    await currentUser.save()

    // Send email notification (non-blocking)
    sendFollowNotificationEmail(targetUser.email, targetUser.name, currentUser.name).catch(() => {})

    return res.status(200).json(targetUser)
}

const unfollowUserRequest = async (req, res) => {
    let targetUser = await User.findById(req.params.uid).select("-password")
    let currentUser = await User.findById(req.user._id)

    //Check If Both User Exists
    if (!targetUser || !currentUser) {
        return res.status(404).json({ message: "User Not Found" })
    }

    // Check If Already followed
    if (!targetUser.followers.some(f => f.toString() === currentUser._id.toString())) {
        return res.status(409).json({ message: "Already Un-Followed!" })
    }

    // Remove Follower 
    let updatedFollowerList = targetUser.followers.filter(follower => follower.toString() !== currentUser._id.toString())
    targetUser.followers = updatedFollowerList
    await targetUser.save()

    // Remove Following 
    let updatedFollowingList = currentUser.following.filter(following => following.toString() !== targetUser._id.toString())
    currentUser.following = updatedFollowingList
    await currentUser.save()

    return res.status(200).json(targetUser)
}
const followController = { followUserRequest, unfollowUserRequest }

export default followController