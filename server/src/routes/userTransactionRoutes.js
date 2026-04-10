import express from "express";
import { requestBorrow, getMyTransactions, requestReturn } from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Hanya butuh login, tidak perlu Admin
router.use(verifyToken);

router.get("/me", getMyTransactions);
router.post("/borrow", requestBorrow);
router.put("/:id/return", requestReturn);

export default router;