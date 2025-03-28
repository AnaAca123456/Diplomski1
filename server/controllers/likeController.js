import Like from "../models/Like.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post nije pronađen." });

        const existing = await Like.findOne({ post: postId, user: userId });

        if (!existing) {
            const like = new Like({ post: postId, user: userId });
            await like.save();
            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

            if (post.author.toString() !== userId.toString()) {
                await Notification.create({
                    recipient: post.author,
                    sender: userId,
                    type: "like",
                    post: post._id,
                });
            }

            return res.status(201).json({ message: "Post lajkovan." });
        } else {
            await existing.deleteOne();
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            return res.status(200).json({ message: "Like uklonjen." });
        }
    } catch (err) {
        console.error("Greška kod lajkovanja:", err);
        res.status(500).json({ message: "Greška kod lajkovanja." });
    }
};



export const getLikesForPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const likes = await Like.find({ post: postId }).populate("user", "firstName lastName");
        res.status(200).json(likes);
    } catch (err) {
        res.status(500).json({ message: "Greška pri dohvatanju lajkova." });
    }
};
