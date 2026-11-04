import express from "express";
import { getRecommendation } from "../controllers/aiController";
import { validateRecommendation } from "../middleware/validateRecommendation";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/recommendation", verifyToken, validateRecommendation, getRecommendation);

export default router;
