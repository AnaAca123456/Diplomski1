import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js"; 

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;

        const userId = req.user._id; 

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post nije pronađen." });
        }

        const comment = new Comment({
            post: postId,
            author: req.user._id,
            text,
        });

        await comment.save();

        await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment._id },
        });

        if (post.author.toString() !== userId.toString()) {
            const alreadyCommented = await Notification.findOne({
                recipient: post.author,
                sender: userId,
                post: postId,
                type: "comment",
                text: text,
            });

            if (!alreadyCommented) {
                await Notification.create({
                    recipient: post.author,
                    sender: userId,
                    type: "comment",
                    post: postId,
                });
            }
        }


        res.status(201).json({ comment });
    } catch (err) {
        console.error("Greška pri dodavanju komentara:", err);
        res.status(500).json({ message: "Greška pri dodavanju komentara." });
    }
};

export const getCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate("author", "firstName lastName")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: "Greška pri dohvatanju komentara." });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Komentar nije pronađen." });

        if (
            comment.author.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Nemate dozvolu da obrišete komentar." });
        }

        await comment.deleteOne();
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id },
        });

        res.status(200).json({ message: "Komentar obrisan." });
    } catch (err) {
        res.status(500).json({ message: "Greška pri brisanju komentara." });
    }
};
