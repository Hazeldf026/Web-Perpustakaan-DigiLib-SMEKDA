import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/layout/AdminNavbar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar Kiri - Tetap */}
            <AdminNavbar />

            {/* Konten Kanan - Dinamis sesuai URL */}
            <div className="flex-1 overflow-y-auto">
                <Outlet /> 
            </div>
        </div>
    );
};

export default AdminLayout;