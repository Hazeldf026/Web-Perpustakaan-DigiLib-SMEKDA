import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';

const Favorit = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('user_token');
            try {
                const response = await fetch("http://localhost:5000/api/favorites/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                const data = await response.json();
                if (response.ok) {
                    setFavorites(data);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar favorit:", error);
                toast.error("Gagal mengambil data favorit");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150x200?text=No+Cover";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:5000/uploads/covers/${imagePath}`;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Buku Favorit Saya ❤️</h1>
                <p className="text-gray-500 mt-1">Koleksi buku-buku pilihan yang ingin kamu simpan atau baca nanti.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20 text-gray-500 font-medium animate-pulse">
                    Memuat koleksi favoritmu...
                </div>
            ) : favorites.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm mt-10">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Heart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Favorit</h3>
                    <p className="text-gray-500 mb-6">Kamu belum menambahkan buku apa pun ke daftar favoritmu.</p>
                    <Link to={`/user/dashboard/discover`} className="inline-block bg-[#4e8a68] text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition shadow-lg hover:-translate-y-1 transform">
                        Cari Buku Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {favorites.map((book) => (
                        <Link to={`/user/book/${book.id}`} key={book.id} className="group cursor-pointer block">
                            <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-3 aspect-3/4 bg-gray-200">
                                <img 
                                    src={getImageUrl(book.coverImage)} 
                                    alt={book.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                {/* Label Favorit di sudut gambar */}
                                <span className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-red-500">
                                    <Heart size={16} className="fill-current" />
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 truncate group-hover:text-green-800 transition">{book.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{book.author}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorit;