import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ identifier: '', newPassword: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                // Pindah ke halaman tunggu dengan membawa identifier
                navigate(`/waiting-reset/${formData.identifier}`);
            } else {
                alert("Gagal mengirim permintaan. Periksa kembali NIS/NIP kamu.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-black text-gray-800 mb-2">Lupa Password?</h2>
                <p className="text-gray-500 text-sm mb-6">Masukkan NIS/NIP dan password baru yang kamu inginkan.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="NIS / NIP kamu" required 
                        className="w-full bg-gray-100 px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#4e8a68]"
                        onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password Baru" required 
                        className="w-full bg-gray-100 px-5 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#4e8a68]"
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                    <button className="w-full bg-[#4e8a68] text-white font-bold py-3 rounded-full shadow-lg">
                        Kirim Permintaan Ke Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;