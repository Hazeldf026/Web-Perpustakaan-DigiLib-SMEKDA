import { prisma } from "../config/db.js";

// 1. Toggle (Tambah/Hapus) Favorit
export const toggleFavorite = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id; // Diambil dari token saat login

        // Cek apakah buku sudah difavoritkan oleh user ini
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_bookId: { userId, bookId: Number(bookId) }
            }
        });

        if (existingFavorite) {
            // Jika sudah ada, HAPUS (Unfavorite)
            await prisma.favorite.delete({ where: { id: existingFavorite.id } });
            return res.status(200).json({ message: "Dihapus dari favorit", isFavorited: false });
        } else {
            // Jika belum ada, TAMBAHKAN (Favorite)
            await prisma.favorite.create({
                data: { userId, bookId: Number(bookId) }
            });
            return res.status(201).json({ message: "Ditambahkan ke favorit", isFavorited: true });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// 2. Cek Status Favorit (Untuk 1 buku)
export const checkFavorite = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const favorite = await prisma.favorite.findUnique({
            where: { userId_bookId: { userId, bookId: Number(bookId) } }
        });

        // Kembalikan boolean: true jika difavoritkan, false jika tidak
        res.status(200).json({ isFavorited: !!favorite }); 
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// 3. Ambil Semua Daftar Buku Favorit User
export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                book: {
                    include: { genres: true } // Tarik juga data genrenya
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Karena hasilnya berupa array of "Favorite", kita ekstrak isi "book"-nya saja
        const books = favorites.map(fav => fav.book);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};