import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import LogoJudul from "../../assets/LogoJudul.png"
import Reading from "../../assets/reading.jpeg"

const LoginUser = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Terjadi kesalahan saat login");
            }

            if (data.user.role !== "MEMBER") {
                throw new Error("Akses ditolak! Silahkan login di halaman Admin.");
            }

            localStorage.setItem('user_token', data.token);
            localStorage.setItem('user_data', JSON.stringify(data.user));

            navigate('/user/dashboard/discover');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex h-screen w-full bg-white font-sans">

            {/* bagian kiri */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative p-8">

                {/* tombol back */}
                <button
                    onClick={() => navigate('/')}
                    className="flex absolute top-4 left-4 gap-2 font-semibold items-center text-gray-600 hover:text-green-800 transition"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </button>

                <div className="mb-8 text-center">
                    <img src={LogoJudul} alt="DigiLab" className="h-20 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Masuk User</h2>
                    <p className="text-gray-500 text-sm">Senang melihat Anda kembali!</p>
                </div>

                {/* pesan error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                    {/* input email/identifier */}
                    <div>
                        <input 
                            type="text" 
                            placeholder="Email/NIS/NISN/NIP"
                            className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* input password */}
                    <div className="relative w-full"> 
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password"
                            className="w-full bg-gray-100 pl-5 pr-12 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-800 transition-colors"
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    {/* Forgot password */}
                    <div className="text-sm text-right pr-2">
                        <Link to="/forgot-password" className="text-green-800 font-bold hover:underline">Lupa Password?</Link>
                    </div>

                    {/* login button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isLoading} 
                            className={`w-full text-white font-bold px-6 py-3 rounded-full shadow-lg transition mt-4 ${isLoading ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-900'}`}
                        >
                            {isLoading ? 'Memproses...' : 'Login'}
                        </button>
                    </div>

                    {/* register */}
                    <div className="flex gap-1.5 text-sm justify-center pt-2">
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Belum punya akun? <Link to="/register-user" className="text-green-800 font-bold hover:underline">Daftar</Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* bagian kanan */}
            <div className="hidden md:block w-1/2 h-full">
                <img 
                    src={Reading} 
                    alt="Membaca" 
                    className="w-full h-full object-cover rounded-l-[3rem] shadow-2xl"
                    />
            </div>

        </div>
    )
}

export default LoginUser;