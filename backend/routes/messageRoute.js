import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import protectedAuth from "../middleware/protectedAuth.js";

const router = express.Router();

router.post('/send/:id', protectedAuth, sendMessage)
router.get('/:id', protectedAuth, getMessages)

export default router;