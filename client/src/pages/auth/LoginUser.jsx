import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoJudul from "../../assets/LogoJudul.png"
import Reading from "../../assets/reading.jpeg"

const LoginUser = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            //tembak api
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            //cek jika response adalah error (400, 401, 404)
            if (!response.ok) {
                throw new Error(data.message || "Terjadi kesalahan saat login");
            }

            //validasi role admin dan user
            if (data.user.role !== "MEMBER") {
                throw new Error("Akses ditolak! Silahkan login di halaman Admin.");
            }

            //jika sukses, simpan token dan data user ke local storage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            //arahkan ke dashboard user
            navigate('/user/dashboard');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white font-sans">

            {/* bagian kiri */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">

                {/* tombol back */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-4 left-4 text-gray-600 hover:text-green-700 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>

                {/* logo */}
                <div className="mb-5">
                    <img src={LogoJudul} alt="DigiLab SMEKDA" className="h-26" />
                </div>

                {/* card form login */}
                <div className="bg-white p-10 rounded-4xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-[80%] max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Login User</h2>

                    {/* pesan error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* input email/identifier */}
                        <div>
                            <input 
                                type="text" 
                                placeholder="Email/NIS/NIP"
                                className="w-full bg-gray-100 px-5 py-4 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* input password */}
                        <div>
                            <input 
                                type="password" 
                                placeholder="Password"
                                className="w-full bg-gray-100 px-5 py-4 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Forgot password */}
                        <div className="text-sm text-right pr-2">
                            <a href="#" className="text-green-700 underline hover:text-black hover:no-underline font-bold">Forgot Password?</a>
                        </div>

                        {/* login button */}
                        <div className="pt-2 flex justify-center">
                            <button
                                type="submit"
                                className="bg-green-800 text-white font-bold px-12 py-3 rounded-full hover:bg-green-800 transition shadow-lg"
                            >
                                {isLoading ? 'Memproses...' : 'Login'}
                            </button>
                        </div>

                        {/* register */}
                        <div className="flex gap-1.5 text-sm justify-center pt-2">
                            <p>Don't have an account?</p>
                            <a href="#" className="text-green-700 underline font-bold hover:no-underline hover:text-black">Sign Up</a>
                        </div>
                    </form>
                </div>
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