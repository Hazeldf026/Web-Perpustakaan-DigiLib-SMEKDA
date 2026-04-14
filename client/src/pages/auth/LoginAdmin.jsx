import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import LogoJudul from "../../assets/LogoJudul.png"
import Administration from "../../assets/administration.jpg"


const LoginAdmin = () => {
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
    
                if (data.user.role !== "ADMIN") {
                    throw new Error("Akses ditolak! Ini adalah area khusus Admin.");
                }
    
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
    
                navigate('/admin/dashboard');
    
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
            <div className="hidden md:block w-1/2 h-full">
                <img 
                    src={Administration} 
                    alt="Membaca" 
                    className="w-full h-full object-cover rounded-r-[3rem] shadow-2xl"
                    />
            </div>
            
            {/* bagian kanan */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">

                {/* tombol back */}
                <button
                    onClick={() => navigate('/')}
                    className="flex absolute top-4 right-4 gap-2 font-semibold items-center text-gray-600 hover:text-green-800 transition"
                >
                    Kembali
                    <ArrowRight size={20} />
                </button>

                <div className="mb-8 text-center">
                    <img src={LogoJudul} alt="DigiLab" className="h-20 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Masuk Admin</h2>
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
                </form>
            </div>

        </div>
    )
}

export default LoginAdmin;