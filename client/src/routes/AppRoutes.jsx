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

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            {/* auth */}
            <Route path="/login-user" element={<LoginUser />} />
            <Route path="/login-admin" element={<LoginAdmin />} />

            <Route path="/admin" element={<AdminLayout />}>
                {/* /admin/dashboard */}
                <Route path="dashboard" element={<AdminDashboard />} /> 
                {/* /admin/databuku */}
                <Route path="buku" element={<DataBuku />} />
                {/* /admin/dataanggota */}
                <Route path="anggota" element={<DataAnggota />} />
                {/* /admin/request */}
                <Route path="request" element={<Request />} />
                {/* /admin/datatransaksi */}
                <Route path="transaksi" element={<DataTransaksi />} />
            </Route>

            <Route path="/user/dashboard" element={<UserLayout />}>
                <Route path="discover" element={<Discover />} />
                <Route path="genre" element={<Genre />} />
                <Route path="favorit" element={<Favorit />} />
                <Route path="transaksi" element={<UserTransaksi />} />
            </Route>
            <Route path="/user" element={<UserLayout />}>
                <Route path="book/:id" element={<BookDetail />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;