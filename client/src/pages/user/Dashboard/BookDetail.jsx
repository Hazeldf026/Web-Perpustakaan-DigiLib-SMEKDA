import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isFavLoading, setIsFavLoading] = useState(false);

    // === STATE MODAL PEMINJAMAN ===
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [borrowDays, setBorrowDays] = useState(1);
    const [returnDateInfo, setReturnDateInfo] = useState(null);
    const [isWeekendError, setIsWeekendError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookDetailAndFavoriteStatus = async () => {
            try {
                const bookRes = await fetch(`http://localhost:5000/api/books/${id}`, { headers: { "Authorization": `Bearer ${token}` }});
                if (bookRes.ok) setBook(await bookRes.json());
                else { navigate('/user/discover'); return; }

                const favRes = await fetch(`http://localhost:5000/api/favorites/check/${id}`, { headers: { "Authorization": `Bearer ${token}` }});
                if (favRes.ok) setIsFavorited((await favRes.json()).isFavorited);
            } catch (error) { console.error("Gagal mengambil data:", error); } finally { setIsLoading(false); }
        };
        fetchBookDetailAndFavoriteStatus();
    }, [id, navigate, token]);

    // === LOGIKA TANGGAL & VALIDASI WEEKEND ===
    useEffect(() => {
        if (!isBorrowModalOpen) return;
        
        const date = new Date();
        date.setDate(date.getDate() + Number(borrowDays));
        
        setReturnDateInfo(date);

        // 0 = Minggu, 6 = Sabtu
        const day = date.getDay();
        if (day === 0 || day === 6) {
            setIsWeekendError(true);
        } else {
            setIsWeekendError(false);
        }
    }, [borrowDays, isBorrowModalOpen]);

    const handleToggleFavorite = async () => {
        setIsFavLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/favorites/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ bookId: id })
            });

            if (response.ok) {
                const data = await response.json();
                setIsFavorited(data.isFavorited); // Update state sesuai balasan server
            }
        } catch (error) {
            console.error("Gagal mengubah favorit:", error);
        } finally {
            setIsFavLoading(false);
        }
    };

    // === FUNGSI SUBMIT PINJAM ===
    const submitBorrowRequest = async (e) => {
        e.preventDefault();
        if (isWeekendError) return; // Cegah submit jika error
        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/my-transactions/borrow", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ bookId: id, days: borrowDays })
            });
            const data = await response.json();
            
            if (response.ok) {
                setIsBorrowModalOpen(false);
                // Beralih ke page transaksi
                navigate('/user/dashboard/transaksi'); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Gagal request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300x450?text=No+Cover";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:5000/uploads/covers/${imagePath}`;
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 mt-20">Memuat informasi buku...</div>;
    if (!book) return null;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Tombol Kembali (Tetap) */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#4e8a68] font-semibold mb-8 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Kembali
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col md:flex-row gap-10">
                {/* (Bagian Kiri Cover & Bagian Kanan Detail Tetap Sama) */}
                <div className="w-full md:w-1/3 shrink-0">
                    <div className="rounded-2xl overflow-hidden shadow-xl aspect-3/4 bg-gray-100 relative">
                        <img src={getImageUrl(book.coverImage)} alt={book.title} className="w-full h-full object-cover"/>
                    </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <div>
                        <div className="mb-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {book.stock > 0 ? `Tersedia ${book.stock} Buku` : 'Stok Habis'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-800 mb-2">{book.title}</h1>
                        <p className="text-xl text-gray-500 font-medium mb-6">Karya: <span className="text-[#4e8a68]">{book.author}</span></p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {book.genres && book.genres.map(genre => (
                                <Link 
                                    key={genre.id} 
                                    to={`/user/genre/${genre.id}`} 
                                    className="bg-gray-100 text-gray-600 hover:text-[#4e8a68] hover:bg-green-50 px-3 py-1 rounded-full text-sm font-semibold border border-gray-200 hover:border-green-200 transition"
                                >
                                    {genre.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Sinopsis</h3>
                            <p className="text-gray-600 leading-relaxed text-justify">{book.synopsis || "-"}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {/* Tombol Buka Modal Pinjam */}
                        <button 
                            onClick={() => setIsBorrowModalOpen(true)}
                            disabled={book.stock < 1}
                            className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ${book.stock > 0 ? 'bg-green-800 hover:bg-green-900' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {book.stock > 0 ? 'Pinjam Buku Ini' : 'Sedang Dipinjam'}
                        </button>
                        
                        {/* Tombol Favorit (Tetap) */}
                        <button onClick={handleToggleFavorite} disabled={isFavLoading} className={`px-6 py-4 rounded-xl font-bold border transition flex items-center justify-center gap-2 ${isFavorited ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-red-400'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* === MODAL PEMINJAMAN === */}
            {isBorrowModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="bg-green-800 p-6 text-white text-center">
                            <h2 className="text-xl font-bold">Pengajuan Peminjaman</h2>
                            <p className="text-sm text-green-100 mt-1">Konfirmasi detail buku pilihanmu</p>
                        </div>
                        
                        <form onSubmit={submitBorrowRequest} className="p-6">
                            {/* Detail Buku di Modal */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Judul Buku</p>
                                <p className="font-bold text-gray-800 text-lg mb-3 leading-tight">{book.title}</p>
                                
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-gray-500">Kode Buku</p>
                                        <p className="font-bold">{book.bookCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500">Stok Tersedia</p>
                                        <p className="font-bold text-green-800">{book.stock} Buku</p>
                                    </div>
                                </div>
                            </div>

                            {/* Input Durasi */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Durasi Peminjaman (Hari)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="14"
                                    required
                                    value={borrowDays}
                                    onChange={(e) => setBorrowDays(e.target.value)}
                                    className="w-full text-center text-xl font-bold bg-gray-100 border-2 border-transparent outline-none focus:border-green-800 focus:bg-white rounded-xl px-4 py-3 transition"
                                />
                            </div>

                            {/* Info Tanggal Pengembalian & Validasi */}
                            <div className={`p-4 rounded-xl border ${isWeekendError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                                <p className={`text-sm font-bold mb-1 ${isWeekendError ? 'text-red-700' : 'text-blue-700'}`}>
                                    📅 Rencana Dikembalikan Pada:
                                </p>
                                <p className={`text-xl font-black ${isWeekendError ? 'text-red-600' : 'text-blue-800'}`}>
                                    {returnDateInfo && returnDateInfo.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                                
                                {/* Pesan Error Hari Libur */}
                                {isWeekendError && (
                                    <p className="text-xs text-red-600 mt-2 font-semibold bg-red-100 p-2 rounded-lg">
                                        ⚠️ Sistem Menolak: Tanggal pengembalian tidak boleh jatuh pada hari Sabtu atau Minggu. Silakan tambah atau kurangi durasi peminjaman.
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setIsBorrowModalOpen(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Batal</button>
                                <button type="submit" disabled={isWeekendError || isSubmitting} className={`flex-1 py-3 font-bold text-white rounded-xl shadow-lg transition ${isWeekendError ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-800 hover:bg-green-900'}`}>
                                    {isSubmitting ? 'Memproses...' : 'Kirim Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetail;