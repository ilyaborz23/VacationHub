import express from "express";
import { askQuestion } from "../controllers/mcpController";
import { validateQuestion } from "../middleware/validateQuestion";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/ask", verifyToken, validateQuestion, askQuestion);

export default router;
