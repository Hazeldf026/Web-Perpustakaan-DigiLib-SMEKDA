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