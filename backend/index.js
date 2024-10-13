import express from "express";
import dotenv from "dotenv";
const app = express();
import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import getUserRoute from "./routes/getUserRoute.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => { res.send("Hello World"); });
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/users", getUserRoute);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    connectToMongoDB();
});