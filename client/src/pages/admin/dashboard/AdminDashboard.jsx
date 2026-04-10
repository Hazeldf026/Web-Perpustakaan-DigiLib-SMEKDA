import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');

    // Mengambil nama admin dari Local Storage saat halaman dimuat
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setAdminName(parsedData.name);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // --- DUMMY DATA UNTUK UI (Nanti diganti dengan fetch dari API) ---
    const stats = [
        { title: "Total Buku", value: "1,240", icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></>, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Total Anggota", value: "342", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, color: "text-green-600", bg: "bg-green-100" },
        { title: "Peminjaman Aktif", value: "58", icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>, color: "text-yellow-600", bg: "bg-yellow-100" },
        { title: "Menunggu ACC", value: "12", icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, color: "text-red-600", bg: "bg-red-100" },
    ];

    const recentTransactions = [
        { id: 1, user: "Budi Santoso", book: "Laskar Pelangi", date: "06 Apr 2026", status: "PENDING_BORROW" },
        { id: 2, user: "Siti Aminah", book: "Bumi Manusia", date: "05 Apr 2026", status: "BORROWED" },
        { id: 3, user: "Ahmad Dahlan", book: "Filosofi Teras", date: "05 Apr 2026", status: "PENDING_RETURN" },
        { id: 4, user: "Rina Nose", book: "Sapiens", date: "04 Apr 2026", status: "RETURNED" },
    ];

    // Fungsi pembantu untuk warna badge status
    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING_BORROW': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Menunggu Pinjam</span>;
            case 'BORROWED': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Sedang Dipinjam</span>;
            case 'PENDING_RETURN': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Menunggu Kembali</span>;
            case 'RETURNED': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Selesai</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <>
            {/* Header Navbar */}
                <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Analitik</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-800">{adminName || 'Admin'}</p>
                            <p className="text-xs text-green-600">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                            {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* --- KARTU STATISTIK --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {stat.icon}
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- TABEL TRANSAKSI TERBARU --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Transaksi Perlu Tindakan</h3>
                            <button className="text-sm text-green-600 font-semibold hover:text-green-800">Lihat Semua</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm">
                                        <th className="px-6 py-4 font-medium">Nama Peminjam</th>
                                        <th className="px-6 py-4 font-medium">Buku</th>
                                        <th className="px-6 py-4 font-medium">Tanggal</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentTransactions.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-800">{trx.user}</td>
                                            <td className="px-6 py-4 text-gray-600">{trx.book}</td>
                                            <td className="px-6 py-4 text-gray-600">{trx.date}</td>
                                            <td className="px-6 py-4">{getStatusBadge(trx.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
        </>
    );
};

export default AdminDashboard;