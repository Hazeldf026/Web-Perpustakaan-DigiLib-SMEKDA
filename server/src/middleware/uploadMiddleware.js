import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Pastikan folder tujuan ada, kalau belum ada, buat otomatis
const uploadDir = "public/uploads/covers";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi Penyimpanan & Hashing Nama
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Simpan di folder ini
    },
    filename: (req, file, cb) => {
        // Hash/Acak nama file: WaktuSekarang-AngkaAcak.ekstensi
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// 3. Filter: Hanya izinkan gambar (JPG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Hanya file gambar yang diizinkan! (JPG/PNG/WEBP)"), false);
    }
};

// 4. Ekspor Middleware (Batas ukuran 5MB)
export const uploadCover = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});