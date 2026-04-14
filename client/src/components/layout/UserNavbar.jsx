import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { getUserId } from '../../utils/auth';
import LogoHijau from "../../assets/logoHijau.png"
import { Compass, Grid2x2, Heart, Scale } from 'lucide-react';

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const socket = useSocket();
    const locationRef = useRef(location);

    const [trxBadge, setTrxBadge] = useState(0);
    const userId = getUserId();

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    // Update locationRef setiap kali location berubah, tanpa re-register listener
    useEffect(() => {
        locationRef.current = location;
    }, [location]);

    // Effect untuk join room — jalan setiap kali socket (re)connect
    useEffect(() => {
        if (!socket || !userId) return;

        const joinRoom = () => {
            socket.emit("join_room", `user_${userId}`);
            console.log(`[Socket] Joined room: user_${userId} (socketId: ${socket.id})`);
        };

        // Emit join_room setiap kali connect (termasuk reconnect setelah server restart)
        socket.on('connect', joinRoom);

        // Jika socket sudah terkoneksi sebelum listener dipasang, join langsung
        if (socket.connected) {
            joinRoom();
        }

        return () => socket.off('connect', joinRoom);
    }, [socket]);

    // Effect untuk listen event transaction_update — tidak bergantung pada location
    useEffect(() => {
        if (!socket) return;

        const handleTransactionUpdate = (data) => {
            // Gunakan locationRef agar selalu dapat nilai location terbaru
            const currentPath = locationRef.current.pathname;
            if (currentPath.includes('/user/dashboard/transaksi')) return;

            setTrxBadge(prev => prev + 1);

            toast.custom((t) => (
                <div 
                    onClick={() => {
                        navigate('/user/dashboard/transaksi');
                        toast.dismiss(t.id);
                        setTrxBadge(0);
                    }}
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-green-800 shadow-2xl rounded-2xl pointer-events-auto flex cursor-pointer transform transition-all hover:scale-105 p-4`}
                >
                    <div className="flex-1 text-white">
                        <p className="text-sm font-black">Status Transaksi Berubah 📖</p>
                        <p className="mt-1 text-sm text-green-100">{data.message}</p>
                    </div>
                </div>
            ), { duration: 5000, position: 'bottom-right' });
        };

        socket.on("transaction_update", handleTransactionUpdate);
        return () => socket.off("transaction_update", handleTransactionUpdate);
    }, [socket, navigate]);

    // Reset badge saat user membuka halaman transaksi
    useEffect(() => {
        if (location.pathname.includes('/user/dashboard/transaksi')) setTrxBadge(0);
    }, [location.pathname]);

    const executeLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLogoutModalOpen(false); // Tutup modal
        navigate('/');
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
                <div className="p-6 text-center border-b border-gray-50">
                    <img src={LogoHijau} alt="logo digilib" className="w-24 mx-auto block my-2"/>
                    <h2 className="text-2xl font-black text-green-800 tracking-wider">DigiLib</h2>
                    <p className="text-sm text-gray-400">Member Area</p>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
                    
                    <Link 
                        to={`/user/dashboard/discover`} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/dashboard/discover') ? 'bg-green-800 text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                    >
                        <Compass />
                        Discover
                    </Link>
                    <Link 
                        to={`/user/dashboard/genre`} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/dashboard/genre') ? 'bg-green-800 text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                    >
                        <Grid2x2 />
                        Kategori Genre
                    </Link>
                    <Link 
                        to={`/user/dashboard/favorit`} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/dashboard/favorit') ? 'bg-green-800 text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                    >
                        <Heart />
                        Buku Favorit
                    </Link>
                    <Link 
                        to={`/user/dashboard/transaksi`} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/dashboard/transaksi') ? 'bg-green-800 text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}>
                        <Scale />
                        Transaksi
                        {/* Titik Merah Transaksi */}
                        {trxBadge > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-md">
                                {trxBadge}
                            </span>
                        )}
                    </Link>
                    <Toaster />
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-500 font-bold rounded-xl hover:bg-red-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* --- MODAL KONFIRMASI LOGOUT --- */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all text-center p-8">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">Keluar Aplikasi?</h3>
                        <p className="text-gray-500 text-sm mb-8">Sesi kamu akan diakhiri dan kamu harus login kembali untuk mengakses perpustakaan.</p>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">
                                Batal
                            </button>
                            <button onClick={executeLogout} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition">
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserNavbar;