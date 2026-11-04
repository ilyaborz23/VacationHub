import express from "express";
import { getVacations, getVacationById } from "../controllers/vacationController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getVacations);
router.get("/:id", verifyToken, getVacationById);

export default router;
