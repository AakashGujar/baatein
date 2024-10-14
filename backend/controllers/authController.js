import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    const { fullName, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    // if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters long' });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: "User already exists" });

        const splitNames = fullName.split(" ");
        let firstName = splitNames[0];
        let lastName = splitNames.length > 1 ? splitNames[splitNames.length - 1] : '';
        const profilePic = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
        
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            profilePic
        });

        await newUser.save();
        await generateTokenAndSetCookie(newUser._id, res)
        
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const match = await bcrypt.compare(password, user?.password || "")
        if (!match) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        await generateTokenAndSetCookie(user._id, res)
        res.json({ msg: `Welcome ${user.fullName}` });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Internal server error' });

    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", " ", { maxAge: 0 })
        res.status(200).json({ msg: 'Logged out successfully' });

    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}