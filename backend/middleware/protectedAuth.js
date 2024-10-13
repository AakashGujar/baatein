import jwt from "jsonwebtoken";
import User from '../models/userModel.js';

const protectedAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token Provided' });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }

        const user = await User.findById(decode.id).select("-password");
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error during protect route middleware:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default protectedAuth;
