import User from "../models/User.js";

export const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Nemate pristup ovoj ruti." });
        }
        next();
    };
};

