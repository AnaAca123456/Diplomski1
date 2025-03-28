import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

export const protect = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Niste prijavljeni." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Korisnik ne postoji." });
        }

        req.user = user;
        req.userId = user._id; 
        req.userRole = user.role;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Nevažeći token." });
    }
};
