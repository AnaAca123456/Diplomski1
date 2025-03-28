import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const {
            role,
            firstName,
            lastName,
            phone,
            birthDate,
            email,
            password,
            confirmPassword,
            licenseNumber,
            companyNames,
            securityCode,
            bio,
        } = req.body;

        const photo = req.file?.filename;

        if (!role || !firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Sva obavezna polja moraju biti popunjena." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Šifre se ne poklapaju." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Korisnik sa tim emailom već postoji." });
        }

        if (role === "admin") {
            return res.status(403).json({ message: "Nije dozvoljena registracija admina." });
        }

        if (role === "mentor" && securityCode !== "250321") {
            return res.status(400).json({ message: "Pogrešan sigurnosni kod za mentore." });
        }

        if (role === "advokat" && !/^(\d{2}\/\d{2})$/.test(licenseNumber)) {
            return res.status(400).json({ message: "Neispravan format broja licence." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            role,
            firstName,
            lastName,
            phone,
            birthDate,
            photo,
            email,
            password: hashedPassword,
            licenseNumber,
            companyNames,
            bio,
        });

        await newUser.save();
        res.status(201).json({ message: "Uspešna registracija." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Greška na serveru." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Pogrešan email ili šifra." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Pogrešan email ili šifra." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ user });
    } catch (err) {
        res.status(500).json({ message: "Greška na serveru." });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token").json({ message: "Uspešno ste se odjavili." });
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ message: "Korisnik nije pronađen." });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Greška na serveru." });
    }
};


export const getMe = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Niste prijavljeni." });
    }
    res.status(200).json({ user: req.user });
};


export const registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, phone, birthDate, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Korisnik sa ovim emailom već postoji." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            role: "admin",
            firstName,
            lastName,
            phone,
            birthDate,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        res.status(201).json({ message: "Admin uspešno registrovan!", user: newAdmin });
    } catch (err) {
        console.error("Greška pri registraciji admina:", err);
        res.status(500).json({ message: "Greška na serveru." });
    }
};