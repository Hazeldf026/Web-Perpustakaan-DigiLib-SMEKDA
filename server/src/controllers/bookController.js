import { prisma } from "../config/db.js";

// 1. GET: Ambil semua data buku
export const getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            include: { genres: true, favorites: true },
            orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data buku", error: error.message });
    }
};

// 2. GET: Ambil satu buku berdasarkan ID
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({ where: { id: Number(id) }, include: { genres: true } });
        
        if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
        
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

// 3. POST: Tambah buku baru (Khusus Admin)
export const createBook = async (req, res) => {
    try {
        // Perhatikan: Data teks ada di req.body, file ada di req.file
        const { bookCode, title, author, publisher, synopsis, stock, genreIds } = req.body;

        const existingBook = await prisma.book.findUnique({ where: { bookCode } });
        if (existingBook) return res.status(400).json({ message: "Kode Buku sudah terdaftar!" });

        // Ambil nama file acak yang digenerate Multer
        const coverImageName = req.file ? req.file.filename : null;

        let parsedGenreIds = [];
        if (genreIds) {
            parsedGenreIds = JSON.parse(genreIds);
        }

        const newBook = await prisma.book.create({
            data: {
                bookCode, title, author, publisher, synopsis, 
                stock: Number(stock) || 1,
                coverImage: coverImageName,
                genres: {
                    connect: parsedGenreIds.map(id => ({ id: Number(id) }))
                }
            }
        });

        res.status(201).json({ message: "Buku berhasil ditambahkan!", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah buku", error: error.message });
    }
};

// 4. PUT: Update data buku (Khusus Admin)
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookCode, title, author, publisher, synopsis, stock, genreIds } = req.body;
        const coverImageName = req.file ? req.file.filename : undefined;

        let parsedGenreIds = [];
        if (genreIds) {
            parsedGenreIds = JSON.parse(genreIds);
        }

        const dataUpdate = {
            bookCode, title, author, publisher, synopsis, stock: Number(stock),
            genres: {
                set: [], // Putus semua genre lama dulu
                connect: parsedGenreIds.map(genreId => ({ id: Number(genreId) })) // Pasang yang baru
            }
        };

        if (coverImageName) dataUpdate.coverImage = coverImageName;

        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: dataUpdate
        });
        
        res.status(200).json({ message: "Data buku berhasil diupdate!", book: updatedBook });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate buku", error: error.message });
    }
};

// PUT: Toggle Rekomendasi Buku (Fitur "Pin")
export const toggleRecommend = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cari buku yang ingin diubah
        const book = await prisma.book.findUnique({ where: { id: Number(id) } });
        if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

        // Balikkan nilainya (toggle)
        const updatedBook = await prisma.book.update({
            where: { id: Number(id) },
            data: { isRecommended: !book.isRecommended }
        });

        res.status(200).json({ 
            message: updatedBook.isRecommended ? "Buku ditambahkan ke Rekomendasi!" : "Buku dihapus dari Rekomendasi", 
            isRecommended: updatedBook.isRecommended 
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengubah status rekomendasi", error: error.message });
    }
};

// 5. DELETE: Hapus buku (Khusus Admin)
export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.book.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ message: "Buku berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus buku", error: error.message });
    }
};