import React, { useState, useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { useSearchParams } from 'react-router-dom';

const Request = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'buku';

    const [bookRequests, setBookRequests] = useState([]);
    const [passRequests, setPassRequests] = useState([]);
    const token = localStorage.getItem('token');
    const [registerRequests, setRegisterRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const [bookRes, passRes, regRes] = await Promise.all([
                fetch("http://localhost:5000/api/transactions/pending", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:5000/api/users/requests/password", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("http://localhost:5000/api/users/requests/register", { headers: { "Authorization": `Bearer ${token}` } })
            ]);
            
            if (bookRes.ok) setBookRequests(await bookRes.json());
            if (passRes.ok) setPassRequests(await passRes.json());
            if (regRes.ok) setRegisterRequests(await regRes.json());
        } catch (error) {
            console.error("Gagal mengambil request:", error);
        }
    };

    const socket = useSocket();

    // Fetch data saat pertama kali halaman dibuka
    useEffect(() => { fetchRequests(); }, []);

    // Auto-refresh tabel saat ada request baru masuk via socket
    useEffect(() => {
        if (!socket) return;
        socket.on('new_request', () => {
            fetchRequests();
        });
        return () => socket.off('new_request');
    }, [socket]);

    // Aksi Buku
    const handleBookAction = async (id, action) => {
        try {
            await fetch(`http://localhost:5000/api/transactions/${id}/action`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ action })
            });
            fetchRequests(); // Refresh data
        } catch (error) { console.error("Gagal memproses aksi:", error); }
    };

    // Aksi Password
    const handlePassAction = async (id, action) => {
        try {
            await fetch(`http://localhost:5000/api/users/${id}/reset-action`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ action })
            });
            fetchRequests();
        } catch (error) { console.error("Gagal memproses aksi:", error); }
    };

    const handleRegisterAction = async (id, action) => {
    try {
        await fetch(`http://localhost:5000/api/users/${id}/register-action`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ action })
        });
        fetchRequests(); // Refresh otomatis
    } catch (error) { console.error(error); }
};

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Pusat Permintaan (Request)</h1>
                <p className="text-gray-500 text-sm mt-1">Tinjau dan proses permintaan dari anggota perpustakaan</p>
            </div>

            {/* TAB NAVIGASI */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setSearchParams({ tab: 'buku' })}
                    className={`pb-3 font-semibold px-2 ${activeTab === 'buku' ? 'border-green-800 text-green-800' : ''}`}
                >
                    Peminjaman & Pengembalian ({bookRequests.length})
                </button>
                <button 
                    onClick={() => setSearchParams({ tab: 'password' })}
                    className={`pb-3 font-semibold px-2 ${activeTab === 'password' ? 'border-green-800 text-green-800' : ''}`}
                >
                    Reset Password ({passRequests.length})
                </button>
                <button 
                    onClick={() => setSearchParams({ tab: 'register' })}
                    className={`pb-3 font-semibold px-2 ${activeTab === 'register' ? 'border-green-800 text-green-800' : ''}`}
                >
                    Pendaftaran Akun ({registerRequests.length})
                </button>
            </div>

            {/* KONTEN TAB BUKU */}
            {activeTab === 'buku' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Peminjam</th>
                                <th className="px-6 py-4">Buku</th>
                                <th className="px-6 py-4">Jenis Request</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bookRequests.length === 0 ? (<tr><td colSpan="4" className="text-center py-8 text-gray-500">Tidak ada request.</td></tr>) : 
                            bookRequests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 border-gray-200">
                                    <td className="px-6 py-4 font-semibold">{req.user.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{req.book.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'PENDING_BORROW' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {req.status === 'PENDING_BORROW' ? 'Minta Pinjam' : 'Minta Kembali'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {req.status === 'PENDING_BORROW' ? (
                                            <>
                                                <button onClick={() => handleBookAction(req.id, 'APPROVE_BORROW')} className="bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-900">Terima Pinjam</button>
                                                <button onClick={() => handleBookAction(req.id, 'REJECT_BORROW')} className="bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-200">Tolak</button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleBookAction(req.id, 'APPROVE_RETURN')} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700">Terima Kembali</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* KONTEN TAB PASSWORD */}
            {activeTab === 'password' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Identifier / NIS</th>
                                <th className="px-6 py-4">Nama User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {passRequests.length === 0 ? (<tr><td colSpan="4" className="text-center py-8 text-gray-500">Tidak ada request.</td></tr>) : 
                            passRequests.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 font-mono">{user.identifier}</td>
                                    <td className="px-6 py-4 font-semibold">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handlePassAction(user.id, 'APPROVE')} className="bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-900">Izinkan</button>
                                        <button onClick={() => handlePassAction(user.id, 'REJECT')} className="bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-200">Tolak</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'register' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">NIS / Identifier</th>
                                <th className="px-6 py-4">Nama Pendaftar</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {registerRequests.length === 0 ? (<tr><td colSpan="4" className="text-center py-8 text-gray-500">Tidak ada request pendaftaran.</td></tr>) : 
                            registerRequests.map(req => (
                                <tr key={req.id}>
                                    <td className="px-6 py-4 font-mono font-bold text-gray-800">{req.identifier}</td>
                                    <td className="px-6 py-4 font-semibold">{req.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{req.email}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleRegisterAction(req.id, 'APPROVE')} className="bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-900">Terima Akun</button>
                                        <button onClick={() => handleRegisterAction(req.id, 'REJECT')} className="bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-200">Tolak (Hapus)</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Request;