import express from "express";
import {
  addVacation,
  deleteVacation,
  getVacations,
  getVacationById,
  getVacationsCsv,
  getVacationsReport,
  likeVacation,
  unlikeVacation,
  updateVacation,
} from "../controllers/vacationController";
import { requireRole } from "../middleware/requireRole";
import { uploadImage } from "../middleware/uploadImage";
import { validateNewVacation, validateVacationUpdate } from "../middleware/validateVacation";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, getVacations);
router.get("/report", verifyToken, requireRole("admin"), getVacationsReport);
router.get("/report/csv", verifyToken, requireRole("admin"), getVacationsCsv);
router.get("/:id", verifyToken, getVacationById);
router.post("/", verifyToken, requireRole("admin"), uploadImage, validateNewVacation, addVacation);
router.put("/:id", verifyToken, requireRole("admin"), uploadImage, validateVacationUpdate, updateVacation);
router.post("/:id/like", verifyToken, requireRole("user"), likeVacation);
router.delete("/:id/like", verifyToken, requireRole("user"), unlikeVacation);
router.delete("/:id", verifyToken, requireRole("admin"), deleteVacation);

export default router;
