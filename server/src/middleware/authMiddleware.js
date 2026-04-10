import jwt from "jsonwebtoken";

// Harus sama persis dengan yang ada di authController / .env
const SECRET_KEY = process.env.JWT_SECRET || "kunci_rahasia_digilab_2026";

// Satpam 1: Cek apakah user sudah login (Punya Token Valid)
export const verifyToken = (req, res, next) => {
    // 1. Ambil token dari header request
    const authHeader = req.headers.authorization;

    // Jika tidak ada header Authorization atau tidak diawali kata 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Akses ditolak! Token tidak ditemukan." });
    }

    // Pisahkan kata "Bearer" dan ambil tokennya saja
    const token = authHeader.split(" ")[1];

    try {
        // 2. Verifikasi keaslian token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 3. Simpan data user dari token (id, role) ke dalam objek request
        req.user = decoded; 
        
        // 4. Lanjut ke proses berikutnya (Controller)
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Token tidak valid atau sudah kadaluwarsa!" });
    }
};

// Satpam 2: Cek apakah user adalah ADMIN
// CATATAN: Middleware ini HARUS dipasang SETELAH verifyToken
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Akses ditolak! Anda bukan Admin." });
    }
    next();
};