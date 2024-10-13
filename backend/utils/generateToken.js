import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // XSS cross site scripting
        sameSite: "strict", //Cross-Site Request Forgery - prevents redrecteed to other sites
        secure: process.env.NODE_ENV === 'production' //This option ensures that the cookie is only sent over secure (HTTPS) connections when the application is in production
    });
};

export default generateTokenAndSetCookie;
