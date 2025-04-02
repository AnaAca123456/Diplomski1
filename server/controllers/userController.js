import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcryptjs";

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Korisnik nije pronađen." });

        const posts = await Post.find({ author: user._id });
        res.status(200).json({ user, posts });
    } catch (err) {
        res.status(500).json({ message: "Greška na serveru." });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Greška na serveru." });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Korisnik nije pronađen." });

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phone = req.body.phone || user.phone;
        user.bio = req.body.bio || user.bio;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.file) {
            user.photo = req.file.filename;
        }

        const updatedUser = await user.save();
        res.status(200).json({ updatedUser });
    } catch (err) {
        console.error("❌ Greška pri ažuriranju profila:", err);
        res.status(500).json({ message: "Greška na serveru." });
    }
};