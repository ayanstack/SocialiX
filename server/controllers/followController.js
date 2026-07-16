import User from "../models/userModel.js"

const followUserRequest = async (req, res) => {


    let targetUser = await User.findById(req.params.uid)
    let currentUser = await User.findById(req.user._id)

    //Check If Both User Exists
    if (!targetUser || !currentUser) {
        res.status(404)
        throw new Error("User Not Found");
    }

    // Check If Already Followed
    if (targetUser.followers.includes(currentUser._id)) {
        res.status(409)
        throw new Error("Already Followed!");
    }
    // Add Follower 
    targetUser.followers.push(currentUser._id)
    await targetUser.save()

    // Add Following 
    currentUser.following.push(targetUser._id)
    await currentUser.save()

    res.status(200).json(targetUser).select("-password")
}

const unfollowUserRequest = async (req, res) => {

    let targetUser = await User.findById(req.params.uid)
    let currentUser = await User.findById(req.user._id)

    //Check If Both User Exists
    if (!targetUser || !currentUser) {
        res.status(404)
        throw new Error("User Not Found");
    }

    // Check If Already followed
    if (!targetUser.followers.includes(currentUser._id)) {
        res.status(409)
        throw new Error("Already Un-Followed!");
    }

    // Remove Follower 
    let updatedFollowerList = targetUser.followers.filter(follower => follower.toString() !== currentUser._id.toString())
    targetUser.followers = updatedFollowerList
    await targetUser.save()

    // Remove Following 
    let updatedFollowingList = currentUser.following.filter(follower => follower.toString() !== targetUser._id.toString())
    currentUser.following = updatedFollowerList
    await currentUser.save()

    res.status(200).json(targetUser).select("-password")

    res.send("Unfollowed")

}
const followController = { followUserRequest, unfollowUserRequest }

export default followController