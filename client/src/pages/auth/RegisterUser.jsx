import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import LogoJudul from "../../assets/LogoJudul.png";
import Reading from "../../assets/reading.jpeg";
import useDocumentTitle from '../../hooks/useDocumentTitle';

const RegisterUser = () => {
    useDocumentTitle("Daftar");

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ identifier: '', name: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            setError("Password minimal harus 8 karakter!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok! Silakan periksa kembali.");
            return; 
        }

        setIsLoading(true);
        setError('');

        try {
            const { confirmPassword, ...payloadData } = formData;

            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadData)
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/waiting-approval/${formData.identifier}`);
            } else {
                alert(data.message);
            }

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
        <div className="flex h-screen w-full bg-white font-sans ">
            
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative p-8">

                {/* tombol back */}
                <button
                    onClick={() => navigate('/login-user')}
                    className="flex absolute top-4 left-4 gap-2 font-semibold items-center text-gray-600 hover:text-green-800 transition"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </button>

                <div className="mb-8 text-center">
                    <img src={LogoJudul} alt="DigiLab" className="h-20 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Daftar Akun Baru</h2>
                    <p className="text-gray-500 text-sm">Lengkapi data untuk bergabung ke perpustakaan</p>
                </div>

                {/* pesan error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
                    <input type="text" placeholder="NIS / NISN / NIP" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition" value={formData.identifier} onChange={(e) => setFormData({...formData, identifier: e.target.value})} />
                    <input type="text" placeholder="Nama Lengkap" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <div className="relative w-full"> 
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password"
                            className="w-full bg-gray-100 pl-5 pr-12 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                    <div className="relative w-full"> 
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Confirm Password"
                            className="w-full bg-gray-100 pl-5 pr-12 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                    
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className={`w-full text-white font-bold px-6 py-3 rounded-full shadow-lg transition mt-4 ${isLoading ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-900'}`}
                    >
                        {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Sudah punya akun? <Link to="/login-user" className="text-green-800 font-bold hover:underline">Masuk</Link>
                    </p>
                </form>
            </div>
            
            <div className="hidden md:block w-1/2 h-full">
                <img src={Reading} alt="Background" className="w-full h-full object-cover rounded-l-[3rem] shadow-2xl"/>
            </div>
        </div>
    );
};

export default RegisterUser;