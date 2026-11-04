import express from "express";
import { register } from "../controllers/authController";
import { validateRegister } from "../middleware/validateRegister";

const router = express.Router();

router.post("/register", validateRegister, register);

export default router;
