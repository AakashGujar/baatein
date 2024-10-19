import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { z } from "zod";

const signupSchema = z.object({
    fullName: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
});

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword } = signupSchema.safeParse(req.body);

        if (!fullName.success) {
            return res.status(400).json({ errors: fullName.error.errors });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const splitNames = fullName.value.fullName.split(" ");
        const firstName = splitNames[0];
        const lastName = splitNames.length > 1 ? splitNames[splitNames.length - 1] : '';

        const profilePic = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
        const newUser = new User({
            fullName: fullName.value.fullName,
            username,
            password: hashedPassword,
            profilePic,
        });

        await generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = loginSchema.safeParse(req.body);

        if (!username.success) {
            return res.status(400).json({ errors: username.error.errors });
        }

        const user = await User.findOne({ username });
        const match = await bcrypt.compare(password.value, user?.password || "");
        if (!user || !match) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        await generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", " ", { maxAge: 0 });
        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
