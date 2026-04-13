import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

// 1. GET: Ambil semua anggota (Role: MEMBER)
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

// 2. POST: Tambah Anggota Baru (Khusus Admin)
export const createMember = async (req, res) => {
    try {
        const { identifier, name, email, password } = req.body;

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

// 3. PUT: Update Data Anggota
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

// 4. DELETE: Hapus Anggota
export const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Anggota berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus anggota", error: error.message });
    }
};

// GET: Lihat akun yang minta ACC
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

// PUT: Proses ACC / Tolak Register
export const processRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'APPROVE' atau 'REJECT'

        if (action === 'APPROVE') {
            await prisma.user.update({
                where: { id: Number(id) },
                data: { isApproved: true }
            });
            return res.status(200).json({ message: "Akun berhasil di-ACC!" });
        } else if (action === 'REJECT') {
            // Jika ditolak, hapus pendaftarannya agar dia bisa daftar ulang nanti jika salah data
            await prisma.user.delete({ where: { id: Number(id) } });
            return res.status(200).json({ message: "Pendaftaran ditolak dan dihapus." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};