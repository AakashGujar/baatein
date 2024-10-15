import jwt from "jsonwebtoken";
import User from '../models/userModel.js';

const protectedAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error during protected route middleware:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export default protectedAuth;
