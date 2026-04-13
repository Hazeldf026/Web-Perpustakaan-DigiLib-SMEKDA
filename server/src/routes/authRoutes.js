import express from "express";
import { register, login, forgotPassword, checkResetStatus } from "../controllers/authController.js";

const router = express.Router();

// Alamat: /api/auth/register
router.post("/register", register);

// Alamat: /api/auth/login
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.get("/reset-status/:identifier", checkResetStatus);

export default router;