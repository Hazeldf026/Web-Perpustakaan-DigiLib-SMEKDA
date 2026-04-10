import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Alamat: /api/auth/register
router.post("/register", register);

// Alamat: /api/auth/login
router.post("/login", login);

export default router;