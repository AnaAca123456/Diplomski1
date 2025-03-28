import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const postData = {
            ...req.body,
            author: req.userId,
        };

        if (req.file) {
            postData.businessPlanFile = req.file.filename;
        }

        const newPost = new Post(postData);
        await newPost.save();
        res.status(201).json({ message: "Post uspešno kreiran." });
    } catch (err) {
        res.status(500).json({ message: "Greška prilikom kreiranja posta." });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "firstName lastName role")
            .populate("comments");
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Greška pri učitavanju postova." });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "firstName lastName role")
            .populate({
                path: "comments",
                populate: { path: "author", select: "firstName lastName" },
            });

        if (!post) return res.status(404).json({ message: "Post nije pronađen." });
        res.status(200).json({ post });
    } catch (err) {
        res.status(500).json({ message: "Greška na serveru." });
    }
};

export const updatePost = async (req, res) => {
    try {
        console.log("🟠 Ušao u updatePost");
        console.log("📦 req.body:", req.body);
        console.log("📁 req.file:", req.file);

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post ne postoji." });

        const authorId = post.author._id || post.author;
        console.log("👤 Post.author:", authorId);
        console.log("👥 req.userId:", req.userId);

        if (authorId.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "Nemate dozvolu da menjate ovaj post." });
        }

        const updatedData = { ...req.body };
        ["author", "_id", "likes", "comments", "createdAt", "updatedAt", "__v"].forEach(
            (field) => delete updatedData[field]
        );
        if (Array.isArray(updatedData.type)) {
            updatedData.type = updatedData.type[0];
        }

        if (req.file) {
            updatedData.businessPlanFile = req.file.filename;
        }

        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] === undefined || updatedData[key] === null) {
                delete updatedData[key];
            }
        });

        console.log("📦 updatedData koje pokušavamo da pošaljemo:", updatedData);

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json(updatedPost);

    } catch (err) {
        console.error("❌ Greška u updatePost:", err);
        res.status(500).json({ message: "Nešto je pošlo po zlu u updatePost funkciji." });
    }
};


export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post ne postoji." });

        if (req.userId !== post.author.toString() && req.userRole !== "admin") {
            return res.status(403).json({ message: "Nemate pravo da obrišete ovaj post." });
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post obrisan." });
    } catch (err) {
        res.status(500).json({ message: "Greška prilikom brisanja posta." });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const userId = req.userId;

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        }

        await post.save();
        res.status(200).json({ message: "Lajk ažuriran." });
    } catch (err) {
        res.status(500).json({ message: "Greška kod lajka." });
    }
};

export const markLegal = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.legalStatus = "legal";
        await post.save();
        res.status(200).json({ message: "Post označen kao legalan." });
    } catch (err) {
        res.status(500).json({ message: "Greška kod pravne ocene." });
    }
};

export const markIllegal = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.legalStatus = "illegal";
        await post.save();
        res.status(200).json({ message: "Post označen kao nelegalan." });
    } catch (err) {
        res.status(500).json({ message: "Greška kod pravne ocene." });
    }
};

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        const newComment = new Comment({
            text,
            post: req.params.id,
            author: req.userId,
        });

        await newComment.save();

        const post = await Post.findById(req.params.id);
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({ comment: newComment });
    } catch (err) {
        res.status(500).json({ message: "Greška prilikom komentara." });
    }
};
export const ratePost = async (req, res) => {
    try {
        const { value } = req.body;

        if (!value || value < 1 || value > 5) {
            return res.status(400).json({ message: "Ocena mora biti između 1 i 5." });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post ne postoji." });

        post.ratings = post.ratings.filter(r => r.user.toString() !== req.userId.toString());

        post.ratings.push({ user: req.userId, value });
        await post.save();

        res.status(200).json({ message: "Uspešno ocenjen post." });
    } catch (err) {
        console.error("Greška pri ocenjivanju:", err);
        res.status(500).json({ message: "Greška na serveru." });
    }
};

