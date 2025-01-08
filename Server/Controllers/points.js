import mongoose from "mongoose";
import users from "../Models/Auth.js"; // Fixed relative path

export const pointsController = async (req, res) => {
    const { id: _id } = req.params;
    const { Viewer } = req.body; // Assume the Viewer ID is passed in the request body
  
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Video Unavailable.");
    }
  
    try {
        let updatedUser;
        const user = await users.findById(Viewer);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Check if the video has already been viewed by the user
        if (!user.viewedVideos.some((videoId) => videoId.equals(_id))) {
            updatedUser = await users.findByIdAndUpdate(
                Viewer,
                {
                    $addToSet: { viewedVideos: _id },
                    $inc: { points: 5 } // Increment points by 5
                },
                { new: true }
            );
        } else {
            updatedUser = user; // No changes needed if video already viewed
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
