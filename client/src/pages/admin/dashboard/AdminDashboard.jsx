import React, { useState, useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { LibraryBig, Users, BookOpen, Bell, ClockFading } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

const AdminDashboard = () => {
    useDocumentTitle("Dashboard");

    const [data, setData] = useState({
        stats: { totalBooks: 0, totalMembers: 0, activeLoans: 0, totalPending: 0 },
        recentActivities: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const socket = useSocket();
    const token = localStorage.getItem('admin_token');

    const fetchDashboardData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/dashboard/stats", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                setData(result);
            }
        } catch (error) {
            console.error("Gagal memuat dashboard:", error);
            toast.error("Gagal memuat data dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("new_request", () => {
            fetchDashboardData();
        });
        return () => socket.off("new_request");
    }, [socket]);

    const statsCards = [
        { title: "Total Koleksi", value: data.stats.totalBooks, icon: <LibraryBig />, color: "bg-blue-50 text-blue-600" },
        { title: "Anggota Aktif", value: data.stats.totalMembers, icon: <Users />, color: "bg-green-50 text-green-600" },
        { title: "Buku Dipinjam", value: data.stats.activeLoans, icon: <BookOpen />, color: "bg-purple-50 text-purple-600" },
        { title: "Antrean Request", value: data.stats.totalPending, icon: <Bell />, color: "bg-red-50 text-red-600" },
    ];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Memuat statistik...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Ringkasan Perpustakaan</h1>
            
            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statsCards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                            {card.icon}
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Aktivitas Terbaru</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {data.recentActivities.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">Belum ada aktivitas terbaru.</p>
                        ) : (
                            data.recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-sm">
                                        <ClockFading />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800">
                                            <span className="font-bold">{activity.user.name}</span> {
                                                activity.status === 'BORROWED' ? 'meminjam' : 
                                                activity.status === 'RETURNED' ? 'mengembalikan' : 'mengajukan'
                                            } buku <span className="font-semibold italic">"{activity.book?.title || <em className="text-gray-400">{"Buku Dihapus"}</em>}"</span>
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {new Date(activity.updatedAt).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;