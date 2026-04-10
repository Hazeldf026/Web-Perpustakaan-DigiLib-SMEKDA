import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../components/layout/UserNavbar';

const UserLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-sans">
            <UserNavbar />
            <div className="flex-1 overflow-y-auto">
                <Outlet /> 
            </div>
        </div>
    );
};

export default UserLayout;