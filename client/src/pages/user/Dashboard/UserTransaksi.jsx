import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../../context/SocketContext';
import { getUserId } from '../../../utils/auth';
import { BookMarked } from 'lucide-react';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const UserTransaksi = () => {
    useDocumentTitle("Transaksi");

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('user_token');
    const userId = getUserId();

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedTrxId, setSelectedTrxId] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/my-transactions/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) setTransactions(await response.json());
        } catch (error) {
            console.error("Gagal mengambil transaksi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const socket = useSocket();

    useEffect(() => {
        if (!socket || !userId) return;

        const joinRoom = () => {
            socket.emit("join_room", `user_${userId}`);
            console.log(`[UserTransaksi] Joined room: user_${userId}`);
        };

        socket.on('connect', joinRoom);
        if (socket.connected) joinRoom();

        return () => socket.off('connect', joinRoom);
    }, [socket, userId]);

    useEffect(() => {
        fetchTransactions();
        if (!socket) return;

        const handleUpdate = () => {
            console.log('[UserTransaksi] transaction_update received, refreshing...');
            fetchTransactions();
        };

        socket.on("transaction_update", handleUpdate);
        return () => socket.off("transaction_update", handleUpdate);
    }, [socket]);

    const openReturnModal = (id) => {
        setSelectedTrxId(id);
        setIsReturnModalOpen(true);
    };

    const requestReturnBook = async (id) => {
        
        try {
            const response = await fetch(`http://localhost:5000/api/my-transactions/${id}/return`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchTransactions();
                toast.success("Request pengembalian terkirim! Silakan serahkan buku fisik ke Admin.");
                setIsReturnModalOpen(false);
            } else {
                toast.error("Gagal mengirim request pengembalian.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Terjadi kesalahan sistem.");
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING_BORROW': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">Menunggu ACC Pinjam</span>;
            case 'BORROWED': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Buku Sedang Dipinjam</span>;
            case 'PENDING_RETURN': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">Menunggu ACC Kembali</span>;
            case 'RETURNED': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Selesai Dikembalikan</span>;
            case 'REJECTED': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Request Ditolak Admin</span>;
            default: return <span>{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Riwayat Transaksiku</h1>
                <p className="text-gray-500 mt-1">Lacak status buku yang kamu pinjam di sini.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-4 font-bold">Info Buku</th>
                            <th className="px-6 py-4 font-bold">Tanggal ACC Pinjam</th>
                            <th className="px-6 py-4 font-bold">Tenggat Kembali</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {isLoading ? (<tr><td colSpan="5" className="text-center py-10">Memuat data...</td></tr>) : 
                        transactions.length === 0 ? (<tr><td colSpan="5" className="text-center py-10 text-gray-500">Belum ada transaksi.</td></tr>) : 
                        transactions.map(trx => (
                            <tr key={trx.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-800">{trx.book?.title || <em className="text-gray-400">{"Buku Dihapus"}</em>}</p>
                                    <p className="text-xs text-gray-500 mt-1">Kode: {trx.book?.bookCode || "-"}</p>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-600">{formatDate(trx.borrowDate)}</td>
                                <td className="px-6 py-4 font-medium text-red-600">{formatDate(trx.dueDate)}</td>
                                <td className="px-6 py-4">{getStatusBadge(trx.status)}</td>
                                <td className="px-6 py-4 text-right">
                                    {trx.status === 'BORROWED' && (
                                        <button onClick={() => openReturnModal(trx.id)} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-green-900 transition">
                                            Kembalikan
                                        </button>
                                    )}
                                    {trx.status !== 'BORROWED' && <span className="text-gray-400 text-sm font-medium">-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL KONFIRMASI PENGEMBALIAN BUKU --- */}
            {isReturnModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8">
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookMarked size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-center text-gray-800 mb-4">Pengembalian Buku</h3>
                        
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm font-medium mb-8 text-center border border-yellow-200">
                            <strong>Peringatan:</strong> Pastikan kamu sudah siap untuk membawa <strong>buku fisik</strong> kembali ke ruang perpustakaan sekarang juga. Admin tidak akan melakukan ACC sebelum menerima buku fisik tersebut.
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setIsReturnModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">
                                Nanti Saja
                            </button>
                            <button onClick={() => requestReturnBook(selectedTrxId)} className="flex-1 py-3 bg-green-800 text-white font-bold rounded-xl shadow-lg hover:bg-green-900 transition">
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTransaksi;