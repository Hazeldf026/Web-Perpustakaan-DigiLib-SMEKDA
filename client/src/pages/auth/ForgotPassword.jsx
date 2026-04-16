import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ForgotPassword = () => {
    useDocumentTitle("Lupa Password");

    const [formData, setFormData] = useState({ identifier: '', newPassword: '', confirmPassword: '' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            setError("Password minimal harus 8 karakter!");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok! Silakan periksa kembali.");
            return; 
        }

        setError('');
        setIsLoading(true);

        try {
            const { confirmPassword, ...payloadData } = formData;

            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadData)
            });
            if (res.ok) {
                navigate(`/waiting-reset/${formData.identifier}`);
            } else {
                setError("Gagal mengirim permintaan. Periksa kembali NIS/NIP kamu.");
            }
        } catch (err) {
            setError(err.message)
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">

            {/* tombol back */}
            <button
                onClick={() => navigate('/login-user')}
                className="flex absolute top-4 left-4 gap-2 font-semibold items-center text-gray-600 hover:text-green-800 transition"
            >
                <ArrowLeft size={20} />
                Kembali
            </button>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-black text-gray-800 mb-2">Lupa Password?</h2>
                <p className="text-gray-500 text-sm mb-6">Masukkan NIS/NIP dan password baru yang kamu inginkan.</p>

                {/* pesan error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8 text-sm text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="NIS / NISN / NIP" required 
                        className="w-full bg-gray-100 pl-5 pr-12 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                        onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                    />
                    <div className="relative w-full"> 
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password"
                            className="w-full bg-gray-100 pl-5 pr-12 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-green-800 transition"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
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
                        {isLoading ? 'Memproses...' : 'Kirim Permintaan'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;