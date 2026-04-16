import { Routes, Route } from "react-router-dom";

import Home from '../pages/public/Home';
import LoginUser from "../pages/auth/LoginUser";
import LoginAdmin from "../pages/auth/LoginAdmin";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import DataBuku from "../pages/admin/books/DataBuku";
import DataAnggota from "../pages/admin/members/DataAnggota";
import UserLayout from "../layouts/UserLayout";
import Discover from "../pages/user/Dashboard/Discover";
import Genre from "../pages/user/Dashboard/Genre";
import Favorit from "../pages/user/Dashboard/Favorit";
import BookDetail from "../pages/user/Dashboard/BookDetail";
import Request from "../pages/admin/request/Request";
import DataTransaksi from "../pages/admin/transactions/DataTransaksi";
import UserTransaksi from "../pages/user/Dashboard/UserTransaksi";
import RegisterUser from "../pages/auth/RegisterUser";
import WaitingApproval from "../pages/auth/WaitingApproval";
import ForgotPassword from "../pages/auth/ForgotPassword";
import WaitingReset from "../pages/auth/WaitingReset";
import GenreBooks from "../pages/user/Dashboard/GenreBooks";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* auth */}
            <Route path="/login-user" element={<LoginUser />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
            <Route path="/register-user" element={<RegisterUser />} />
            <Route path="/waiting-approval/:identifier" element={<WaitingApproval />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/waiting-reset/:identifier" element={<WaitingReset />} />

            <Route path="/admin" element={<ProtectedRoute roleRequired="ADMIN"><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} /> 
                <Route path="buku" element={<DataBuku />} />
                <Route path="anggota" element={<DataAnggota />} />
                <Route path="request" element={<Request />} />
                <Route path="transaksi" element={<DataTransaksi />} />
            </Route>

            <Route path="/user/dashboard" element={<ProtectedRoute roleRequired="MEMBER"><UserLayout /></ProtectedRoute>}>
                <Route path="discover" element={<Discover />} />
                <Route path="genre" element={<Genre />} />
                <Route path="favorit" element={<Favorit />} />
                <Route path="transaksi" element={<UserTransaksi />} />
            </Route>
            <Route path="/user" element={<ProtectedRoute roleRequired="MEMBER"><UserLayout /></ProtectedRoute>}>
                <Route path="book/:id" element={<BookDetail />} />
                <Route path="genre/:id" element={<GenreBooks />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;