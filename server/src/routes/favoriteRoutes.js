import express from "express";
import { toggleFavorite, checkFavorite, getUserFavorites } from "../controllers/favoriteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua fungsi favorit wajib login (verifyToken)
router.post("/toggle", verifyToken, toggleFavorite);
router.get("/check/:bookId", verifyToken, checkFavorite);
router.get("/me", verifyToken, getUserFavorites);

export default router;