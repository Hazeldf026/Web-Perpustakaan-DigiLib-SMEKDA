import express from "express";
import { getAllTransactions, getPendingTransactions, processTransaction } from "../controllers/transactionController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyToken, isAdmin);

router.get("/", getAllTransactions);
router.get("/pending", getPendingTransactions);
router.put("/:id/action", processTransaction);

export default router;