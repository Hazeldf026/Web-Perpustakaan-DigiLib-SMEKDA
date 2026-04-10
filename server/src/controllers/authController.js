import { prisma } from  "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "kunci_rahasia_digilab_2026";

export const register = async (req, res) => {
try {
    const { name, identifier, email, password, role } = req.body;

    // Validasi field wajib
    if (!name || !identifier || !email || !password) {
    return res.status(400).json({ message: "Semua field (name, identifier, email, password) wajib diisi!" });
    }

    // 1. Cek apakah email sudah dipakai?
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
    return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // 2. Cek apakah identifier (NIS/NIP) sudah dipakai?
    const existingIdentifier = await prisma.user.findUnique({ where: { identifier } });
    if (existingIdentifier) {
    return res.status(400).json({ message: "Identifier (NIS/NIP) sudah terdaftar!" });
    }

    // 3. Acak password (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke Database
    const user = await prisma.user.create({
    data: {
        name,
        identifier,
        email,
        password: hashedPassword,
        role: role || "MEMBER", // Default jadi MEMBER kalau tidak diisi
    },
    });

    res.status(201).json({ message: "Registrasi berhasil!", user });
} catch (error) {
    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
    const field = error.meta?.target?.includes("email") ? "Email" : "Identifier (NIS/NIP)";
    return res.status(400).json({ message: `${field} sudah terdaftar!` });
    }
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
}
};

export const login = async (req, res) => {
try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    // 2. Cek password (Bandingkan input dengan yang di DB)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
    return res.status(401).json({ message: "Password salah!" });
    }

    // 3. Bikin Token (JWT)
    const token = jwt.sign(
    { id: user.id, role: user.role }, // Data yang disimpan dalam token
    SECRET_KEY,
    { expiresIn: "1d" } // Token kadaluwarsa dalam 1 hari
    );

    res.json({ message: "Login berhasil!", token, user: { name: user.name, role: user.role } });
} catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
}
};