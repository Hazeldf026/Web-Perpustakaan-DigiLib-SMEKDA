import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LogoJudul from "../../assets/LogoJudul.png";
import Reading from "../../assets/reading.jpeg";

const RegisterUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ identifier: '', name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/pending-approval');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white font-sans">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative p-8">
                <div className="mb-8 text-center">
                    <img src={LogoJudul} alt="DigiLab" className="h-20 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Daftar Akun Baru</h2>
                    <p className="text-gray-500 text-sm">Lengkapi data untuk bergabung ke perpustakaan</p>
                </div>

                <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
                    <input type="text" placeholder="NIS / NISN / NIP" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#4e8a68]" value={formData.identifier} onChange={(e) => setFormData({...formData, identifier: e.target.value})} />
                    <input type="text" placeholder="Nama Lengkap" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#4e8a68]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#4e8a68]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" required className="w-full bg-gray-100 px-5 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#4e8a68]" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    
                    <button type="submit" disabled={isLoading} className={`w-full text-white font-bold px-6 py-3 rounded-full shadow-lg transition mt-4 ${isLoading ? 'bg-gray-400' : 'bg-[#4e8a68] hover:bg-green-800'}`}>
                        {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Sudah punya akun? <Link to="/login-user" className="text-[#4e8a68] font-bold hover:underline">Masuk di sini</Link>
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