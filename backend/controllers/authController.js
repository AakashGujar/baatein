import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


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

        if (newUser) {
            await generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }


    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const match = await bcrypt.compare(password, user?.password || "")
        if (!user || !match) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        await generateTokenAndSetCookie(user._id, res)
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