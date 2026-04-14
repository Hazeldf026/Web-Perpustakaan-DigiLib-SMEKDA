import { prisma } from "../config/db.js";

// 1. GET: Ambil SEMUA transaksi (Untuk halaman Data Transaksi)
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: { user: true, book: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil transaksi", error: error.message });
    }
};

// 2. GET: Ambil HANYA transaksi yang butuh ACC (Untuk halaman Request)
export const getPendingTransactions = async (req, res) => {
    try {
        const pending = await prisma.transaction.findMany({
            where: {
                status: { in: ['PENDING_BORROW', 'PENDING_RETURN'] }
            },
            include: { user: true, book: true },
            orderBy: { createdAt: 'asc' } // Yang paling lama antre, muncul duluan
        });
        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil request", error: error.message });
    }
};

// 3. PUT: Proses ACC / Tolak Transaksi
export const processTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'APPROVE_BORROW', 'REJECT_BORROW', 'APPROVE_RETURN'

        const transaction = await prisma.transaction.findUnique({ 
            where: { id: Number(id) }, include: { book: true, user: true } 
        });

        if (!transaction) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

        const io = req.app.get("io");

        // Logika Aksi Admin
        if (action === 'APPROVE_BORROW') {
            if (transaction.book.stock < 1) return res.status(400).json({ message: "Stok buku habis!" });
            
            // Kurangi stok & Set status dipinjam (Tenggat: 7 hari dari sekarang)
            await prisma.$transaction([
                prisma.transaction.update({
                    where: { id: Number(id) },
                    data: { 
                        status: 'BORROWED', 
                        borrowDate: new Date(), 
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
                    }
                }),
                prisma.book.update({
                    where: { id: transaction.bookId },
                    data: { stock: { decrement: 1 } }
                })
            ]);

            // Kirim notif ke user bahwa peminjaman disetujui
            const targetRoom = `user_${transaction.userId}`;
            console.log(`[Socket] Emitting transaction_update to room: ${targetRoom}`);
            io.to(targetRoom).emit("transaction_update", { 
                message: `Peminjaman buku "${transaction.book.title}" kamu telah disetujui! 🎉` 
            });

            return res.json({ message: "Peminjaman disetujui!" });
        } 
        
        else if (action === 'REJECT_BORROW') {
            await prisma.transaction.update({
                where: { id: Number(id) },
                data: { status: 'REJECTED' }
            });

            // Kirim notif ke user bahwa peminjaman ditolak
            const targetRoom2 = `user_${transaction.userId}`;
            console.log(`[Socket] Emitting transaction_update to room: ${targetRoom2}`);
            io.to(targetRoom2).emit("transaction_update", { 
                message: `Peminjaman buku "${transaction.book.title}" kamu ditolak oleh Admin.` 
            });

            return res.json({ message: "Peminjaman ditolak." });
        }

        else if (action === 'APPROVE_RETURN') {
            // Tambah stok & Set status dikembalikan
            await prisma.$transaction([
                prisma.transaction.update({
                    where: { id: Number(id) },
                    data: { status: 'RETURNED', returnDate: new Date() }
                }),
                prisma.book.update({
                    where: { id: transaction.bookId },
                    data: { stock: { increment: 1 } }
                })
            ]);

            // Kirim notif ke user bahwa pengembalian disetujui
            const targetRoom3 = `user_${transaction.userId}`;
            console.log(`[Socket] Emitting transaction_update to room: ${targetRoom3}`);
            io.to(targetRoom3).emit("transaction_update", { 
                message: `Pengembalian buku "${transaction.book.title}" kamu telah dikonfirmasi! ✅` 
            });

            return res.json({ message: "Pengembalian disetujui!" });
        }

        res.status(400).json({ message: "Aksi tidak valid" });
    } catch (error) {
        res.status(500).json({ message: "Gagal memproses transaksi", error: error.message });
    }
};

// ==========================================
// FUNGSI KHUSUS USER (ANGGOTA)
// ==========================================

// 1. User request pinjam buku
export const requestBorrow = async (req, res) => {
    try {
        const { bookId, days } = req.body;
        const userId = req.user.id;

        // Hitung tenggat waktu (dueDate)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Number(days));

        // Validasi ekstra di backend: Tolak jika jatuh pada Sabtu(6) atau Minggu(0)
        const dayOfWeek = dueDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return res.status(400).json({ message: "Tanggal pengembalian tidak boleh hari Sabtu atau Minggu!" });
        }

        // Cek apakah user masih ada transaksi menggantung untuk buku ini
        const existing = await prisma.transaction.findFirst({
            where: { 
                userId, bookId: Number(bookId), 
                status: { in: ['PENDING_BORROW', 'BORROWED', 'PENDING_RETURN'] } 
            }
        });
        if (existing) return res.status(400).json({ message: "Kamu masih memiliki proses transaksi aktif untuk buku ini." });

        const trx = await prisma.transaction.create({
            data: {
                userId,
                bookId: Number(bookId),
                status: 'PENDING_BORROW',
                dueDate // Catat target tanggal kembali
            }
        });

        const io = req.app.get("io");
        io.emit("new_request", { type: 'buku', message: "Permintaan peminjaman baru masuk!" });

        res.status(201).json({ message: "Permintaan peminjaman berhasil dikirim ke Admin!", transaction: trx });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// 2. User lihat riwayat transaksinya sendiri
export const getMyTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id },
            include: { book: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// 3. User request kembalikan buku
export const requestReturn = async (req, res) => {
    try {
        const { id } = req.params;
        const trx = await prisma.transaction.findUnique({ where: { id: Number(id) } });
        
        if (!trx || trx.userId !== req.user.id) return res.status(403).json({ message: "Akses ditolak" });

        await prisma.transaction.update({
            where: { id: Number(id) },
            data: { status: 'PENDING_RETURN' }
        });

        const io = req.app.get("io");
        io.emit("new_request", { type: 'buku', message: "Permintaan pengembalian buku masuk!" });

        res.status(200).json({ message: "Permintaan pengembalian dikirim ke Admin!" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};