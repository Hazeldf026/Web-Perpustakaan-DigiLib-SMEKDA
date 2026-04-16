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

    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password minimal harus 8 karakter!" });
    }

    // Cek email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
    return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Cek Identifier
    const existingIdentifier = await prisma.user.findUnique({ where: { identifier } });
    if (existingIdentifier) {
    return res.status(400).json({ message: "NIS/NISN/NIP sudah terdaftar!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Masukkan ke database
    const user = await prisma.user.create({
    data: {
        name,
        identifier,
        email,
        password: hashedPassword,
        role: role || "MEMBER",
        isApproved: false 
    },
    });

    // Notifikasi real-time pendaftaran baru
    const io = req.app.get("io");
    io.emit("new_request", { 
        type: 'register', 
        message: `Pendaftaran baru: ${user.name}` 
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

export const checkRegistrationStatus = async (req, res) => {
    try {
        const { identifier } = req.params;
        const user = await prisma.user.findUnique({
            where: { identifier },
            select: { isApproved: true }
        });

        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
        
        res.status(200).json({ approved: user.isApproved });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

export const login = async (req, res) => {
try {
    const { email, loginId, password } = req.body;

    const userInput = loginId || email;

    // Cari user berdasarkan email atau identifier
    const user = await prisma.user.findFirst({ 
        where: { 
            OR: [
                { email: userInput },
                { identifier: userInput }
            ]
        } 
    });

    if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan! Periksa kembali Email/NIS/NISN/NIP Anda." });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
    return res.status(401).json({ message: "Password salah!" });
    }

    // Cek persetujuan Admin
    if (user.role === 'MEMBER' && !user.isApproved) {
        return res.status(403).json({ message: "Akun Anda belum di-ACC oleh Admin. Harap tunggu." });
    }

    // Bikin Token (JWT)
    const token = jwt.sign(
    { id: user.id, role: user.role }, // Data yang disimpan dalam token
    SECRET_KEY,
    { expiresIn: "1d" } // Token kadaluwarsa dalam 1 hari
    );

    res.json({ message: "Login berhasil!", token, user: { id: user.id, name: user.name, role: user.role } });
} catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
}
};

export const forgotPassword = async (req, res) => {
    try {
        const { identifier, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { identifier } });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { identifier },
            data: {
                isResetPending: true,
                pendingNewPassword: hashedPassword
            }
        });

        const io = req.app.get("io");
        io.emit("new_request", {
            type: 'password',
            message: `Permintaan ganti password: ${identifier}`
        });

        res.status(200).json({ message: "Permintaan reset password terkirim!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const checkResetStatus = async (req, res) => {
    try {
        const { identifier } = req.params;
        const user = await prisma.user.findUnique({
            where: { identifier },
            select: { isResetPending: true }
        });
        
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
        
        res.status(200).json({ approved: !user.isResetPending });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

export const loginQR = async (req, res) => {
    try {
        const { qrSecret } = req.body;

        if (!qrSecret) return res.status(400).json({ message: "QR Secret tidak boleh kosong" });

        // Cari user berdasarkan qrSecret yang di-scan
        const user = await prisma.user.findUnique({ where: { qrSecret } });

        if (!user) {
            return res.status(401).json({ message: "QR Code tidak valid atau tidak dikenali!" });
        }

        if (!user.isApproved) {
            return res.status(403).json({ message: "Akun kamu belum disetujui oleh Admin." });
        }

        // Jika valid, buatkan Token JWT (Logikanya sama persis dengan login biasa)
        const token = jwt.sign(
            { id: user.id, role: user.role, identifier: user.identifier }, 
            process.env.JWT_SECRET || "rahasia_digilab", 
            { expiresIn: '1d' }
        );

        // Hapus field sensitif sebelum dikirim ke frontend
        const { password, qrSecret: secret, pendingNewPassword, ...safeUser } = user;

        res.status(200).json({ 
            message: "Login dengan QR Code berhasil!", 
            token, 
            user: safeUser 
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};