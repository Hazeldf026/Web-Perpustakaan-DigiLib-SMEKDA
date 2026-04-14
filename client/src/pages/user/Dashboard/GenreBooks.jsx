import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GenreBooks = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [genreData, setGenreData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooksByGenre = async () => {
            const token = localStorage.getItem('user_token');
            try {
                const response = await fetch(`http://localhost:5000/api/genres/${id}/books`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    setGenreData(await response.json());
                } else {
                    alert("Genre tidak ditemukan");
                    navigate('/user/genre');
                }
            } catch (error) {
                console.error("Gagal mengambil data buku:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooksByGenre();
    }, [id, navigate]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/150x200?text=No+Cover";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:5000/uploads/covers/${imagePath}`;
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 mt-20">Memuat koleksi buku...</div>;
    if (!genreData) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Tombol Kembali */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-green-800 font-semibold mb-8 transition">
                <ArrowLeft size={20} />
                Kembali
            </button>

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800">Kategori: {genreData.name}</h1>
                <p className="text-gray-500 mt-1">Daftar buku dengan genre {genreData.name}</p>
            </div>

            {genreData.books.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl text-center border border-gray-100 shadow-sm mt-8">
                    <p className="text-gray-500 font-medium">Belum ada buku untuk kategori ini.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {genreData.books.map((book) => (
                        <Link to={`/user/book/${book.id}`} key={book.id} className="group cursor-pointer block">
                            <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-3 aspect-3/4 bg-gray-200">
                                <img src={getImageUrl(book.coverImage)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold text-white rounded-md shadow-md ${book.stock > 0 ? 'bg-green-700' : 'bg-red-500'}`}>
                                    {book.stock > 0 ? 'Tersedia' : 'Habis'}
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

export default GenreBooks;