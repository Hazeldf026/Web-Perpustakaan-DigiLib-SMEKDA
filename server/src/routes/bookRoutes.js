import express from "express";
import { getAllBooks, getBookById, createBook, updateBook, toggleRecommend, deleteBook } from "../controllers/bookController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { uploadCover } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Rute Publik / Member (Hanya butuh login, tidak harus Admin)
router.get("/", verifyToken, getAllBooks);
router.get("/:id", verifyToken, getBookById);

// Rute Khusus Admin (Butuh login + Role ADMIN)
router.post("/", verifyToken, isAdmin, uploadCover.single("coverImage"), createBook);
router.put("/:id", verifyToken, isAdmin, uploadCover.single("coverImage"), updateBook);
router.put("/:id/recommend", verifyToken, isAdmin, toggleRecommend);
router.delete("/:id", verifyToken, isAdmin, deleteBook);

export default router;