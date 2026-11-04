import express from "express";
import { login, register } from "../controllers/authController";
import { validateLogin } from "../middleware/validateLogin";
import { validateRegister } from "../middleware/validateRegister";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;
