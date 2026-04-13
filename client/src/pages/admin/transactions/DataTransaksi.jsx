import React, { useState, useEffect } from 'react';

const DataTransaksi = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch("http://localhost:5000/api/transactions", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) setTransactions(await response.json());
            } catch (error) {
                console.error("Gagal mengambil riwayat:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING_BORROW': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu Pinjam</span>;
            case 'BORROWED': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Sedang Dipinjam</span>;
            case 'PENDING_RETURN': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Menunggu Kembali</span>;
            case 'RETURNED': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Selesai / Kembali</span>;
            case 'REJECTED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Ditolak</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
                <p className="text-gray-500 text-sm mt-1">Daftar seluruh aktivitas peminjaman dan pengembalian perpustakaan</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Peminjam</th>
                            <th className="px-6 py-4">Buku</th>
                            <th className="px-6 py-4">Tgl Pinjam</th>
                            <th className="px-6 py-4">Tgl Kembali</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (<tr><td colSpan="5" className="text-center py-8">Memuat data...</td></tr>) :
                         transactions.map(trx => (
                            <tr key={trx.id} className="hover:bg-gray-50 border-gray-200">
                                <td className="px-6 py-4 font-semibold text-gray-800">{trx.user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{trx.book.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(trx.borrowDate)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(trx.returnDate)}</td>
                                <td className="px-6 py-4">{getStatusBadge(trx.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTransaksi;