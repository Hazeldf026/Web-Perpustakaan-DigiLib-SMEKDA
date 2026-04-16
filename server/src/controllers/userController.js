import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAllMembers = async (req, res) => {
    try {
        const members = await prisma.user.findMany({
            where: { role: 'MEMBER' },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data anggota", error: error.message });
    }
};

export const createMember = async (req, res) => {
    try {
        const { identifier, name, email, password } = req.body;

        if (password && password.length < 8) {
            return res.status(400).json({ message: "Password minimal harus 8 karakter!" });
        }

        const existingUser = await prisma.user.findUnique({ where: { identifier } });
        if (existingUser) {
            return res.status(400).json({ message: "NIS/Identifier sudah terdaftar!" });
        }

        const hashedPassword = await bcrypt.hash(password || "123456", 10);

        const newMember = await prisma.user.create({
            data: {
                identifier,
                name,
                email,
                password: hashedPassword,
                role: 'MEMBER'
            }
        });

        res.status(201).json({ message: "Anggota berhasil ditambahkan!", user: newMember });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah anggota", error: error.message });
    }
};

export const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { identifier, name, email } = req.body;

        const updatedMember = await prisma.user.update({
            where: { id: Number(id) },
            data: { identifier, name, email }
        });

        res.status(200).json({ message: "Data anggota berhasil diupdate!", user: updatedMember });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate anggota", error: error.message });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Anggota berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus anggota", error: error.message });
    }
};

export const getPendingPasswordResets = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { isResetPending: true },
            select: { id: true, identifier: true, name: true, email: true }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

export const processPasswordReset = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;
        const io = req.app.get("io");

        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        if (action === 'APPROVE') {
            await prisma.user.update({
                where: { id: Number(id) },
                data: { password: user.pendingNewPassword, isResetPending: false, pendingNewPassword: null }
            });
            io.to(user.identifier).emit("reset_status", { approved: true, rejected: false });
            return res.json({ message: "Ganti password disetujui." });
        } else {
            await prisma.user.update({
                where: { id: Number(id) },
                data: { isResetPending: false, pendingNewPassword: null }
            });
            io.to(user.identifier).emit("reset_status", { approved: false, rejected: true });
            return res.json({ message: "Ganti password ditolak." });
        }
    } catch (error) { res.status(500).json({ message: "Error", error: error.message }); }
};

export const getPendingRegistrations = async (req, res) => {
    try {
        const pendingUsers = await prisma.user.findMany({
            where: { isApproved: false }
        });
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

export const processRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;
        const io = req.app.get("io");

        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        if (action === 'APPROVE') {
            await prisma.user.update({ where: { id: Number(id) }, data: { isApproved: true } });
            io.to(user.identifier).emit("account_status", { approved: true, rejected: false });
            return res.status(200).json({ message: "Akun berhasil di-ACC!" });
        } else if (action === 'REJECT') {
            await prisma.user.delete({ where: { id: Number(id) } });
            io.to(user.identifier).emit("account_status", { approved: false, rejected: true });
            return res.status(200).json({ message: "Pendaftaran ditolak dan dihapus." });
        }
    } catch (error) { res.status(500).json({ message: "Error", error: error.message }); }
};