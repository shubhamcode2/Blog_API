import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("verifying token", token);

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        const user = await User.findById(decoded?.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = {
            id: user._id,
            userName: user.userName,
            email: user.email,
        };
        console.log("user verified", req.user);

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};