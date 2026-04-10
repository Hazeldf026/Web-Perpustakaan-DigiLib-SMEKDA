import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Fungsi untuk mengecek apakah link aktif
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-[#4e8a68] text-white flex flex-col shadow-xl h-screen sticky top-0">
            <div className="p-6 text-center border-b border-green-800/50">
                <h2 className="text-2xl font-black tracking-wider">DigiLab</h2>
                <p className="text-sm text-green-200">Admin Panel</p>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link 
                    to="/admin/dashboard" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/dashboard') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Dashboard
                </Link>
                <Link 
                    to="/admin/buku" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/buku') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    Data Buku
                </Link>
                <Link 
                    to="/admin/anggota" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/anggota') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Data Anggota
                </Link>
                <Link 
                    to="/admin/transaksi" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/transaksi') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Transaksi
                </Link>
                <Link 
                    to="/admin/request" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/admin/request') ? 'bg-white/20 text-white' : 'text-green-100 hover:bg-white/5'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Request
                </Link>
            </nav>

            <div className="p-4">
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminNavbar;