import React, { useState, useEffect } from 'react';

const DataBuku = () => {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    
    // Checkbox isRecommended sudah dihapus dari sini
    const [formData, setFormData] = useState({
        bookCode: '', title: '', author: '', publisher: '', synopsis: '', stock: 1, genreIds: []
    });
    const [coverFile, setCoverFile] = useState(null);

    const token = localStorage.getItem('token');

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/books", { headers: { "Authorization": `Bearer ${token}` }});
            if (response.ok) setBooks(await response.json());
        } catch (error) { console.error("Error:", error); } finally { setIsLoading(false); }
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/genres", { headers: { "Authorization": `Bearer ${token}` }});
            if (response.ok) setGenres(await response.json());
        } catch (error) { console.error("Error:", error); }
    };

    useEffect(() => { fetchBooks(); fetchGenres(); }, []);

    // --- FUNGSI BARU: PIN / REKOMENDASI BUKU ---
    const handleToggleRecommend = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}/recommend`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                // Refresh data buku agar bintang berubah warna
                fetchBooks();
            }
        } catch (error) {
            console.error("Gagal mengubah rekomendasi:", error);
        }
    };

    // --- FUNGSI PILIH GENRE ---
    const handleGenreSelect = (e) => {
        const selectedId = Number(e.target.value);
        if (!selectedId) return;
        if (!formData.genreIds.includes(selectedId)) {
            setFormData({ ...formData, genreIds: [...formData.genreIds, selectedId] });
        }
        e.target.value = ""; 
    };

    const removeGenre = (idToRemove) => {
        setFormData({ ...formData, genreIds: formData.genreIds.filter(id => id !== idToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        formDataToSend.append('bookCode', formData.bookCode);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('publisher', formData.publisher);
        formDataToSend.append('synopsis', formData.synopsis);
        formDataToSend.append('stock', Number(formData.stock));
        if (formData.genreIds.length > 0) formDataToSend.append('genreIds', JSON.stringify(formData.genreIds));
        if (coverFile) formDataToSend.append('coverImage', coverFile);

        const url = isEditMode ? `http://localhost:5000/api/books/${editId}` : "http://localhost:5000/api/books";
        
        try {
            const response = await fetch(url, {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formDataToSend 
            });

            if (response.ok) {
                closeModal();
                fetchBooks(); 
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) { console.error("Error:", error); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) fetchBooks();
        } catch (error) { console.error("Gagal menghapus:", error); }
    };

    const openAddModal = () => {
        setFormData({ bookCode: '', title: '', author: '', publisher: '', synopsis: '', stock: 1, genreIds: [] });
        setCoverFile(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (book) => {
        setFormData({
            bookCode: book.bookCode, title: book.title, author: book.author, 
            publisher: book.publisher || '', synopsis: book.synopsis || '', stock: book.stock,
            genreIds: book.genres ? book.genres.map(g => g.id) : []
        });
        setCoverFile(null);
        setEditId(book.id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setCoverFile(null); };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Buku</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola koleksi buku perpustakaan DigiLab</p>
                </div>
                <button onClick={openAddModal} className="bg-[#4e8a68] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Tambah Buku
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                                <th className="px-6 py-4 font-medium w-16 text-center">Pin</th>
                                <th className="px-6 py-4 font-medium">Kode</th>
                                <th className="px-6 py-4 font-medium">Judul & Genre</th>
                                <th className="px-6 py-4 font-medium">Stok</th>
                                <th className="px-6 py-4 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-gray-50/50">
                                    {/* --- KOLOM TOMBOL PIN (REKOMENDASI) --- */}
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleToggleRecommend(book.id)}
                                            title={book.isRecommended ? "Hapus dari Pilihan Editor" : "Jadikan Pilihan Editor"}
                                            className={`p-2 rounded-full transition transform hover:scale-110 ${book.isRecommended ? 'text-yellow-400 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-100'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={book.isRecommended ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold">{book.bookCode}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">{book.title}</p>
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {book.genres && book.genres.map(g => (
                                                <span key={g.id} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{g.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{book.stock}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(book)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                                        <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:underline text-sm font-semibold">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM TAMBAH/EDIT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
                        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Pilih Genre</label>
                                <select onChange={handleGenreSelect} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600 bg-white cursor-pointer">
                                    <option value="">+ Tambah Genre</option>
                                    {genres.map((g) => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                                
                                {formData.genreIds.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        {formData.genreIds.map(id => {
                                            const genreObj = genres.find(g => g.id === id);
                                            return genreObj ? (
                                                <span key={id} className="bg-[#4e8a68] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm">
                                                    {genreObj.name}
                                                    <button type="button" onClick={() => removeGenre(id)} className="w-4 h-4 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center transition">×</button>
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Kode Buku</label><input type="text" required value={formData.bookCode} onChange={(e) => setFormData({...formData, bookCode: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600" disabled={isEditMode}/></div>
                                <div><label className="block text-sm font-medium mb-1">Stok</label><input type="number" required min="1" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600"/></div>
                            </div>
                            
                            <div><label className="block text-sm font-medium mb-1">Judul Buku</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600"/></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Penulis</label><input type="text" required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600"/></div>
                                <div><label className="block text-sm font-medium mb-1">Penerbit</label><input type="text" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600"/></div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Unggah Cover Buku</label>
                                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => setCoverFile(e.target.files[0])} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"/>
                            </div>

                            <div><label className="block text-sm font-medium mb-1">Sinopsis</label><textarea rows="3" value={formData.synopsis} onChange={(e) => setFormData({...formData, synopsis: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600 resize-none"></textarea></div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" className="px-6 py-2 bg-[#4e8a68] text-white font-medium rounded-lg hover:bg-green-800">Simpan Buku</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataBuku;