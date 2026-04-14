import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Library } from 'lucide-react';

const Genre = () => {
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            const token = localStorage.getItem('user_token');
            try {
                const response = await fetch("http://localhost:5000/api/genres", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) setGenres(await response.json());
            } catch (error) {
                console.error("Gagal mengambil genre:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGenres();
    }, []);

    const colors = [
        "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-red-500", 
        "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-teal-500", "bg-cyan-500"
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800">Eksplorasi Genre 📚</h1>
                <p className="text-gray-500 mt-1">Temukan buku berdasarkan kategori favoritmu.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Memuat daftar kategori...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {genres.map((genre, index) => {
                        const colorClass = colors[index % colors.length];
                        
                        return (
                            <Link 
                                to={`/user/genre/${genre.id}`} 
                                key={genre.id} 
                                className={`${colorClass} relative h-32 rounded-2xl p-6 text-white overflow-hidden group shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}
                            >
                                <h2 className="text-xl font-bold relative z-10 group-hover:scale-110 transition origin-left">{genre.name}</h2>
                                <Library className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-150 transition duration-500" />
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default Genre;