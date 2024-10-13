import express from 'express'
import { getUsersController } from '../controllers/getUserController.js';
import protectedAuth from '../middleware/protectedAuth.js';

const router = express.Router();

router.get("/", protectedAuth, getUsersController)

export default router;