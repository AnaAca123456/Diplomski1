import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Greška pri dohvatanju korisnika." });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.userId) {
            return res.status(400).json({ message: "Ne možete obrisati sami sebe." });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Korisnik obrisan." });
    } catch (err) {
        res.status(500).json({ message: "Greška pri brisanju korisnika." });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select("-password");

        if (!updated) {
            return res.status(404).json({ message: "Korisnik nije pronađen." });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Greška pri ažuriranju korisnika." });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "firstName lastName role");
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Greška pri pristupu postovima." });
    }
};

export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post obrisan." });
    } catch (err) {
        res.status(500).json({ message: "Greška pri brisanju posta." });
    }
};

export const updatePost = async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Post nije pronađen." });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Greška pri ažuriranju posta." });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate("author", "firstName lastName");
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: "Greška prilikom učitavanja komentara." });
    }
};

export const deleteCommentById = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Komentar obrisan." });
    } catch (err) {
        res.status(500).json({ message: "Greška prilikom brisanja komentara." });
    }
};