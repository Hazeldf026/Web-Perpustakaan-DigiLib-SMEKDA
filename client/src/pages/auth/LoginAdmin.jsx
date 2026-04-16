import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import LogoJudul from "../../assets/LogoJudul.png"
import Administration from "../../assets/administration.jpg"
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';

const LoginAdmin = () => {
    useDocumentTitle("Masuk Admin");

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [isScannerOpen, setIsScannerOpen] = useState(false);
        const html5QrCodeRef = useRef(null);
        const isProcessingQRRef = useRef(false);

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

    const handleQRLogin = async (decodedText) => {
        // Cegah scanner memanggil fungsi ini berkali-kali dalam 1 detik
        if (isProcessingQRRef.current) return;
        isProcessingQRRef.current = true;

        setIsLoading(true);
        stopScanner();
        setIsScannerOpen(false); // Tutup scanner otomatis saat sedang memproses

        // Pengecekan isi QR antisipasi spasi ekstra atau format JSON
        let finalQrSecret = decodedText;
        try {
            const parsed = JSON.parse(decodedText);
            if (parsed && typeof parsed === 'object' && parsed.qrSecret) {
                finalQrSecret = parsed.qrSecret;
            }
        } catch (e) {
            // Abaikan error
        }
        finalQrSecret = finalQrSecret.trim();

        try {
            const response = await fetch("http://localhost:5000/api/auth/login-qr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrSecret: finalQrSecret }) 
            });
            const data = await response.json();

            if (response.ok) {
                if (data.user.role === 'MEMBER') {
                    toast.error("Kartu ini milik Member. Silakan login di panel Member.", { id: 'qr-login-error' });
                    isProcessingQRRef.current = false;
                    return;
                }
                localStorage.setItem('user_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                
                toast.success(`Berhasil login via Kartu Admin! Halo, ${data.user.name} 👋`, { id: 'qr-login-success' });
                navigate('/user/dashboard/discover');
            } else {
                toast.error(data.message, { id: 'qr-login-error' });
                isProcessingQRRef.current = false;
            }
        } catch (error) {
            console.error("QR Login Error:", error);
            toast.error("Gagal membaca kartu. Coba lagi.", { id: 'qr-login-error' });
            isProcessingQRRef.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    const stopScanner = () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop()
                .then(() => { html5QrCodeRef.current.clear(); })
                .catch(err => console.error("Gagal mematikan kamera", err));
        }
    };

    useEffect(() => {
        if (!isScannerOpen) {
            stopScanner();
            return;
        }

        // Delay sedikit agar div 'reader' dirender dulu oleh React
        const startScanner = setTimeout(() => {
            const html5QrCode = new Html5Qrcode("reader");
            html5QrCodeRef.current = html5QrCode;

            html5QrCode.start(
                { facingMode: "environment" }, // Prioritaskan kamera belakang jika di HP
                {
                    fps: 10,    // 10 frame per detik (lebih cepat baca)
                    qrbox: { width: 250, height: 250 } // Area kotak scan
                },
                (decodedText) => {
                    // Berhasil scan!
                    handleQRLogin(decodedText);
                },
                (errorMessage) => {
                    // Abaikan error saat sedang mencari QR
                }
            ).catch(err => {
                console.error("Gagal memulai kamera", err);
                toast.error("Gagal mengakses kamera. Pastikan browser diizinkan mengakses kamera.");
            });
        }, 100); // Delay 100ms

        return () => {
            clearTimeout(startScanner);
            stopScanner();
        };
    }, [isScannerOpen]);

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

                {isScannerOpen ? (
                    <div className="w-full max-w-sm mb-6 animate-enter">
                        <div className="bg-gray-50 p-4 rounded-3xl border-2 border-dashed border-[#4e8a68]">
                            <p className="text-center text-sm font-bold text-gray-500 mb-4 animate-pulse">Arahkan QR Code ke kamera...</p>
                            
                            {/* Kotak tempat kamera muncul */}
                            <div id="reader" className="w-full rounded-2xl overflow-hidden mb-4 shadow-inner bg-black"></div>
                            
                            <button 
                                onClick={() => setIsScannerOpen(false)}
                                className="w-full py-2 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition"
                            >
                                Batal & Gunakan Password
                            </button>
                        </div>
                    </div>
                ) : (
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

                    <div className="relative flex items-center py-4">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="shrink-0 mx-4 text-gray-400 text-sm font-bold">ATAU</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white text-[#4e8a68] border-2 border-[#4e8a68] font-bold px-6 py-3 rounded-full shadow-sm hover:bg-green-50 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6v6H4z"/><path d="M14 4h6v6h-6z"/><path d="M4 14h6v6H4z"/><path d="M14 14h6v6h-6z"/></svg>
                        Scan Kartu
                    </button>
                </form>
                )}
            </div>

        </div>
    )
}

export default LoginAdmin;