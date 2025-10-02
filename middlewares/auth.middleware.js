import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];

        // console.log(token);
        if (!token) {
            return res.status(401).json({
                message: 'Không tồn tại token'
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)
        const user = await User.findById(decoded.id);
        // console.log(user)
        if (!user) {
            return res.status(401).json({
                message: "Token đã được sử dụng hoặc hết hạn"
            })
        }
        req.userId = user._id;
        next();

    } catch (error) {
        console.log(error);
    }
}