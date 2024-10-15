import express from "express";
import dotenv from "dotenv";

const app = express();

import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import getUserRoute from "./routes/getUserRoute.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", getUserRoute);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    connectToMongoDB();
});