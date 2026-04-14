import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { Book, LayoutDashboard, NotebookPen, Scale, Users, LogOut } from 'lucide-react';
import LogoPutih from "../../assets/LogoPutih.png"

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const socket = useSocket();
    const [requestCount, setRequestCount] = useState(0);

    useEffect(() => {
        if (!socket) return;

        socket.on("new_request", (data) => {
            const currentTab = searchParams.get('tab') || 'buku';
            const isOnTargetTab = location.pathname === '/admin/request' && currentTab === data.type;

            if (isOnTargetTab) {
                return; 
            }

            setRequestCount(prev => prev + 1);
            
            toast.custom((t) => (
                <div 
                    onClick={() => {
                        navigate(`/admin/request?tab=${data.type}`);
                        toast.dismiss(t.id);
                        setRequestCount(0);
                    }}
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-green-800 shadow-2xl rounded-2xl pointer-events-auto flex cursor-pointer transform transition-all hover:scale-105 p-4`}
                >
                    <div className="flex-1 text-white">
                        <p className="text-sm font-black">Notifikasi Baru! 🔔</p>
                        <p className="mt-1 text-sm text-green-100">{data.message}</p>
                    </div>
                </div>
            ), { duration: 5000, position: 'bottom-right' });
        });

        return () => socket.off("new_request");
    }, [socket, location, searchParams, navigate]);

    useEffect(() => {
        if (location.pathname === '/admin/request') setRequestCount(0);
    }, [location.pathname]);

    return (
        <aside className="w-64 bg-green-800 text-white flex flex-col shadow-xl h-screen sticky top-0">
            <div className="p-6 text-center border-b border-green-900">
                <img src={LogoPutih} alt="logo digilib" className="w-24 mx-auto block my-2" />
                <h2 className="text-2xl font-black tracking-wider">DigiLib</h2>
                <p className="text-sm text-green-200">Admin Panel</p>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link 
                    to="/admin/dashboard" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/dashboard') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <LayoutDashboard />
                    Dashboard
                </Link>
                <Link 
                    to="/admin/buku" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/buku') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <Book />
                    Data Buku
                </Link>
                <Link 
                    to="/admin/anggota" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/anggota') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <Users />
                    Data Anggota
                </Link>
                <Link 
                    to="/admin/transaksi" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/transaksi') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <Scale />
                    Transaksi
                </Link>
                <Link 
                    to="/admin/request?tab=buku" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/request') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <NotebookPen />
                    Request
                    {requestCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-md">
                            {requestCount} Baru
                        </span>
                    )}
                </Link>
            </nav>

            <div className="p-4">
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
            <Toaster />
        </aside>
    );
};

export default AdminNavbar;