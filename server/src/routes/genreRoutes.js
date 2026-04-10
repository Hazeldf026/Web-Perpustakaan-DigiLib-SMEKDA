import express from "express";
import { prisma } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ambil semua genre untuk dropdown di frontend
router.get("/", verifyToken, async (req, res) => {
    try {
        const genres = await prisma.genre.findMany();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil genre" });
    }
});

export default router;