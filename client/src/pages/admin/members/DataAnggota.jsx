import React, { useState, useEffect } from 'react';

const DataAnggota = () => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const [formData, setFormData] = useState({
        identifier: '', name: '', email: '', password: ''
    });

    const token = localStorage.getItem('token');

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setMembers(data);
        } catch (error) {
            console.error("Gagal mengambil data anggota:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditMode 
            ? `http://localhost:5000/api/users/${editId}` 
            : "http://localhost:5000/api/users";
        
        const method = isEditMode ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchMembers();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus anggota ini secara permanen?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) fetchMembers();
        } catch (error) {
            console.error("Gagal menghapus:", error);
        }
    };

    const openAddModal = () => {
        setFormData({ identifier: '', name: '', email: '', password: '' });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (member) => {
        setFormData({ identifier: member.identifier, name: member.name, email: member.email, password: '' });
        setEditId(member.id);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Anggota</h1>
                    <p className="text-gray-500 text-sm mt-1">Daftar siswa dan guru terdaftar di DigiLab</p>
                </div>
                <button onClick={openAddModal} className="bg-[#4e8a68] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                    Tambah Anggota
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                            <th className="px-6 py-4 font-medium">NIS / Identifier</th>
                            <th className="px-6 py-4 font-medium">Nama Lengkap</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center py-8">Memuat data...</td></tr>
                        ) : members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-mono text-sm">{member.identifier}</td>
                                <td className="px-6 py-4 font-semibold">{member.name}</td>
                                <td className="px-6 py-4 text-gray-600">{member.email}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button onClick={() => openEditModal(member)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-6">{isEditMode ? 'Edit Anggota' : 'Tambah Anggota Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">NIS / Identifier</label>
                                <input type="text" required value={formData.identifier} onChange={(e) => setFormData({...formData, identifier: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600" placeholder="Misal: 21221001" disabled={isEditMode}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600"/>
                            </div>
                            {!isEditMode && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Password Awal</label>
                                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:border-green-600" placeholder="Default: 123456"/>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Batal</button>
                                <button type="submit" className="px-6 py-2 bg-[#4e8a68] text-white rounded-lg font-bold hover:bg-green-800">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataAnggota;