import express from "express";
import { getAllMembers, createMember, updateMember, deleteMember, getPendingRegistrations, processRegistration } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua rute anggota dilindungi: Harus Login & Harus Admin
router.use(verifyToken, isAdmin);

router.get("/", getAllMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);
router.get("/requests/register", getPendingRegistrations);
router.put("/:id/register-action", processRegistration);

export default router;