import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
            <div className="p-6 text-center border-b border-gray-50">
                <h2 className="text-2xl font-black text-[#4e8a68] tracking-wider">DigiLab</h2>
                <p className="text-sm text-gray-400">Student Area</p>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
                
                <Link 
                    to={`/user/dashboard/discover`} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/discover') ? 'bg-[#4e8a68] text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    Discover
                </Link>
                <Link 
                    to={`/user/dashboard/genre`} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/genre') ? 'bg-[#4e8a68] text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Kategori Genre
                </Link>
                <Link 
                    to={`/user/dashboard/favorit`} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/favorit') ? 'bg-[#4e8a68] text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    Buku Favorit
                </Link>
                <Link 
                    to={`/user/dashboard/transaksi`} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('/user/transaksi') ? 'bg-[#4e8a68] text-white shadow-md' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Riwayat Transaksi
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-50">
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-500 font-bold rounded-xl hover:bg-red-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default UserNavbar;