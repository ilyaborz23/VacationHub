import express from "express";
import {
  getVacations,
  getVacationById,
  likeVacation,
  unlikeVacation,
} from "../controllers/vacationController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getVacations);
router.get("/:id", verifyToken, getVacationById);
router.post("/:id/like", verifyToken, likeVacation);
router.delete("/:id/like", verifyToken, unlikeVacation);

export default router;
