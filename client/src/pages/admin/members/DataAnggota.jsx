import { UserPlus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const DataAnggota = () => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    
    const [formData, setFormData] = useState({
        identifier: '', name: '', email: '', password: ''
    });

    const token = localStorage.getItem('admin_token');

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
            toast.error("Gagal mengambil data anggota");
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
                toast.success(isEditMode ? "Data anggota berhasil diperbarui!" : "Anggota baru berhasil ditambahkan!");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Gagal menyimpan data anggota");
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            toast.error("Terjadi kesalahan server");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus anggota ini secara permanen?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchMembers();
                toast.success("Anggota berhasil dihapus!");
            } else {
                toast.error("Gagal menghapus anggota");
            }
        } catch (error) {
            console.error("Gagal menghapus:", error);
            toast.error("Terjadi kesalahan server");
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

    const openDetailModal = (member) => {
        setSelectedMember(member);
        setIsDetailModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Anggota</h1>
                    <p className="text-gray-500 text-sm mt-1">Daftar siswa dan guru terdaftar di DigiLib</p>
                </div>
                <button onClick={openAddModal} className="bg-green-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-900 transition flex items-center gap-2">
                    <UserPlus />
                    Tambah Anggota
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <th className="px-6 py-4 font-medium">NIS / NISN / NIP</th>
                            <th className="px-6 py-4 font-medium">Nama</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center py-8">Memuat data...</td></tr>
                        ) : members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50/50 border-gray-200">
                                <td className="px-6 py-4 font-mono text-sm">{member.identifier}</td>
                                <td className="px-6 py-4 font-semibold">
                                    <p onClick={() => openDetailModal(member)} className="font-bold text-gray-800 cursor-pointer hover:text-[#4e8a68] transition">
                                        {member.name}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{member.email}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button onClick={() => openDetailModal(member)} className="text-green-600 hover:underline">Detail</button>
                                    <button onClick={() => openEditModal(member)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL DETAIL ANGGOTA */}
            {isDetailModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setIsDetailModalOpen(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        
                        {/* Header Background */}
                        <div className="h-32 bg-linear-to-r from-[#2c5f43] to-[#4e8a68]"></div>
                        
                        <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-200 transition bg-black/20 rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <div className="p-8 pt-0 flex flex-col items-center">
                            {/* Avatar Placeholder */}
                            <div className="w-24 h-24 bg-white rounded-full p-1 -mt-12 shadow-lg mb-4">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-4xl font-black text-gray-300">
                                    {selectedMember.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-800 text-center">{selectedMember.name}</h2>
                            <p className="text-[#4e8a68] font-bold text-sm mb-6">{selectedMember.identifier}</p>

                            <div className="w-full space-y-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">📧</div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Alamat Email</p>
                                        <p className="text-sm font-bold text-gray-800">{selectedMember.email}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">📅</div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Terdaftar Sejak</p>
                                        <p className="text-sm font-bold text-gray-800">{formatDate(selectedMember.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">🛡️</div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Status Keanggotaan</p>
                                        <p className={`text-sm font-bold ${selectedMember.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {selectedMember.isApproved ? 'Aktif Tersertifikasi' : 'Belum Disetujui'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setIsDetailModalOpen(false)} className="w-full mt-8 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                                Tutup Profil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-6">{isEditMode ? 'Edit Anggota' : 'Tambah Anggota Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">NIS / NISN / NIP</label>
                                <input type="text" required value={formData.identifier} onChange={(e) => setFormData({...formData, identifier: e.target.value})} className="w-full rounded-full px-5 py-3 outline-none bg-gray-100 focus:border-green-600" placeholder="Misal: 21221001" disabled={isEditMode}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-full px-5 py-3 outline-none bg-gray-100 focus:border-green-600" placeholder='Jhon doe'/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-full px-5 py-3 outline-none bg-gray-100 focus:border-green-600" placeholder='example@gmail.com'/>
                            </div>
                            {!isEditMode && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Password Awal</label>
                                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full rounded-full px-5 py-3 outline-none bg-gray-100 focus:border-green-600" placeholder="abcde123"/>
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