import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

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
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "Korisnik nije pronađen." });

        const { firstName, lastName, phone, bio, password, confirmPassword } = req.body;

        if (password && password !== confirmPassword) {
            return res.status(400).json({ message: "Šifre se ne poklapaju." });
        }

        if (req.file) {

            if (user.photo) {
                const oldPath = path.join("uploads", user.photo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            user.photo = req.file.filename;
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.bio = bio || user.bio;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({ message: "Profil ažuriran.", user });
    } catch (err) {
        console.error("Greška pri ažuriranju profila:", err);
        res.status(500).json({ message: "Greška pri ažuriranju profila." });
    }
};