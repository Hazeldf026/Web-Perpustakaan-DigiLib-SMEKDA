import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';

const Discover = () => {
    const [userName, setUserName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) setUserName(JSON.parse(userData).name);

        const fetchBooks = async () => {
            const token = localStorage.getItem('user_token');
            try {
                const response = await fetch("http://localhost:5000/api/books", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setBooks(data);
            } catch (error) {
                console.error("Gagal mengambil buku:", error);
                toast.error("Gagal mengambil data buku");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150x200?text=No+Cover";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:5000/uploads/covers/${imagePath}`;
    };

    const recommendedBooks = books.filter(b => b.isRecommended).length > 0 
        ? books.filter(b => b.isRecommended) 
        : books.slice(0, 3);

    const popularBooks = [...books]
        .sort((a, b) => (b.favorites?.length || 0) - (a.favorites?.length || 0))
        .slice(0, 5);

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (recommendedBooks.length <= 1) return;
        const interval = setInterval(() => {
            setActiveCarouselIndex((prev) => (prev + 1) % recommendedBooks.length);
        }, 4000); 
        return () => clearInterval(interval);
    }, [recommendedBooks.length]);


    return (
        <div className="p-8 max-w-7xl mx-auto overflow-hidden">
            
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
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                </div>
            </div>

            {/* JIKA SEDANG LOADING */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Menyiapkan perpustakaan...</div>
            ) : (
                <>
                    {/* --- 1. CAROUSEL REKOMENDASI (CENTERED MODE) --- */}
                    {!searchQuery && recommendedBooks.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Rekomendasi Editor Saat Ini</h2>
                            
                            {/* Area Slider */}
                            <div className="relative flex justify-center items-center h-72 w-full perspective-1000">
                                {recommendedBooks.map((book, index) => {
                                    // Logika Posisi (Kiri, Tengah, Kanan)
                                    let position = "translate-x-full opacity-0 scale-75 z-0"; // Default (Sembunyi)
                                    
                                    if (index === activeCarouselIndex) {
                                        position = "translate-x-0 opacity-100 scale-100 z-20 shadow-2xl"; // Tengah (Aktif)
                                    } else if (index === (activeCarouselIndex - 1 + recommendedBooks.length) % recommendedBooks.length) {
                                        position = "-translate-x-3/4 opacity-60 scale-90 z-10 hidden md:flex"; // Kiri
                                    } else if (index === (activeCarouselIndex + 1) % recommendedBooks.length) {
                                        position = "translate-x-3/4 opacity-60 scale-90 z-10 hidden md:flex"; // Kanan
                                    }

                                    return (
                                        <div key={book.id} className={`absolute transition-all duration-700 ease-in-out w-[90%] md:w-[600px] h-64 rounded-3xl overflow-hidden flex ${position}`}>
                                            
                                            {/* Background Gradient (Bisa diganti warna dinamis jika mau) */}
                                            <div className="absolute inset-0 bg-linear-to-r from-[#2c5f43] to-[#4e8a68] z-0"></div>
                                            
                                            {/* Kiri: Teks & Info */}
                                            <div className="relative z-10 w-2/3 p-6 md:p-8 flex flex-col justify-center text-white">
                                                <span className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm mb-3">
                                                    Rekomendasi
                                                </span>
                                                <h3 className="text-2xl md:text-3xl font-black leading-tight mb-2 truncate">{book.title}</h3>
                                                <p className="text-white/80 text-sm mb-6 truncate">{book.author}</p>
                                                
                                                <Link to={`/user/book/${book.id}`} className="bg-white text-[#2c5f43] w-fit px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition transform">
                                                    Lihat Detail
                                                </Link>
                                            </div>

                                            {/* Kanan: Gambar Buku */}
                                            <div className="relative z-10 w-1/3 bg-gray-100">
                                                <img src={getImageUrl(book.coverImage)} alt={book.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#4e8a68]/20"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Titik-Titik Navigasi (Pagination Dots) */}
                            <div className="flex justify-center gap-2 mt-6">
                                {recommendedBooks.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setActiveCarouselIndex(index)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${index === activeCarouselIndex ? 'w-8 bg-[#4e8a68]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* --- 2. BUKU TERPOPULER (FAVORIT TERBANYAK) --- */}
                    {!searchQuery && popularBooks.length > 0 && (
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Buku Terpopuler 🔥</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {popularBooks.map((book) => (
                                    <Link to={`/user/book/${book.id}`} key={`pop-${book.id}`} className="group cursor-pointer block">
                                        <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-3 aspect-3/4 bg-gray-200">
                                            <img src={getImageUrl(book.coverImage)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            {/* Badge jumlah favorit di pojok kanan atas */}
                                            {book.favorites && book.favorites.length > 0 && (
                                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-red-500 shadow-sm flex items-center gap-1">
                                                    ❤️ {book.favorites.length}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-800 truncate group-hover:text-[#4e8a68] transition">{book.title}</h3>
                                        <p className="text-sm text-gray-500 truncate">{book.author}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* --- 3. SEMUA KOLEKSI BUKU (DAN HASIL PENCARIAN) --- */}
                    <div>
                        <div className="flex justify-between items-center mb-6 pt-6 border-t border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {searchQuery ? 'Hasil Pencarian' : 'Semua Koleksi Buku'}
                            </h2>
                        </div>
                        
                        {filteredBooks.length === 0 ? (
                            <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-500 border border-gray-100">
                                Tidak ada buku yang sesuai dengan pencarianmu.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {filteredBooks.map((book) => (
                                    <Link to={`/user/book/${book.id}`} key={book.id} className="group cursor-pointer block">
                                        <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-3 aspect-3/4 bg-gray-200">
                                            <img src={getImageUrl(book.coverImage)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                </>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .perspective-1000 { perspective: 1000px; }
            `}} />
        </div>
    );
};

export default Discover;