import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Discover = () => {
    const [userName, setUserName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ambil nama user dari Local Storage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUserName(JSON.parse(userData).name);
        }

        // Ambil Data Buku dari Database
        const fetchBooks = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch("http://localhost:5000/api/books", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setBooks(data);
            } catch (error) {
                console.error("Gagal mengambil buku:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Fungsi Render Gambar
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150x200?text=No+Cover";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:5000/uploads/covers/${imagePath}`;
    };

    // Filter pencarian
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Dummy Data untuk Carousel Rekomendasi (Tetap dipertahankan untuk estetika visual)
    const recommendations = [
        { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata", color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
        { id: 2, title: "Bumi Manusia", author: "Pramoedya Ananta Toer", color: "bg-gradient-to-r from-amber-500 to-orange-500" },
        { id: 3, title: "Filosofi Teras", author: "Henry Manampiring", color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            
            {/* HEADER & SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Halo, {userName.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-500 mt-1">Mau baca buku apa hari ini?</p>
                </div>
                <div className="w-full md:w-96 relative">
                    <input 
                        type="text" 
                        placeholder="Cari judul, penulis, atau penerbit..." 
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-full shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#4e8a68] transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="absolute left-4 top-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>

            {/* CAROUSEL REKOMENDASI (CSS Only Scroll Snap) */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pilihan Editor Minggu Ini</h2>
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 hide-scrollbar">
                    {recommendations.map((book) => (
                        <div key={book.id} className={`min-w-[300px] md:min-w-[400px] h-48 rounded-3xl p-6 text-white snap-center shrink-0 shadow-lg relative overflow-hidden ${book.color}`}>
                            <div className="relative z-10">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">Rekomendasi</span>
                                <h3 className="text-2xl font-bold mt-4 mb-1">{book.title}</h3>
                                <p className="text-white/80 text-sm">{book.author}</p>
                                <button className="mt-4 bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-bold shadow-md hover:scale-105 transition transform">
                                    Lihat Detail
                                </button>
                            </div>
                            {/* Dekorasi Abstrak */}
                            <svg className="absolute -right-10 -bottom-10 w-48 h-48 text-white opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
                        </div>
                    ))}
                </div>
            </div>

            {/* GRID BUKU ASLI DARI DATABASE */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {searchQuery ? 'Hasil Pencarian' : 'Semua Koleksi Buku'}
                    </h2>
                </div>
                
                {isLoading ? (
                    <p className="text-gray-500">Memuat koleksi buku...</p>
                ) : filteredBooks.length === 0 ? (
                    <p className="text-gray-500">Tidak ada buku yang ditemukan.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredBooks.map((book) => (
                            <Link to={`/user/book/${book.id}`} key={book.id} className="group cursor-pointer block">
                                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-3 aspect-3/4 bg-gray-200">
                                    <img 
                                        src={getImageUrl(book.coverImage)} 
                                        alt={book.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    {/* Status Stok Kecil di Pojok Kiri */}
                                    <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold text-white rounded-md shadow-md ${book.stock > 0 ? 'bg-[#4e8a68]' : 'bg-red-500'}`}>
                                        {book.stock > 0 ? 'Tersedia' : 'Habis'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 truncate group-hover:text-[#4e8a68] transition">{book.title}</h3>
                                <p className="text-sm text-gray-500 truncate">{book.author}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* CSS Tambahan untuk menyembunyikan scrollbar tapi tetap bisa di-scroll */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default Discover;