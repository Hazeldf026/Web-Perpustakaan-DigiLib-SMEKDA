import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WaitingReset = () => {
    const { identifier } = useParams();
    const navigate = useNavigate();
    const [isApproved, setIsApproved] = useState(false);

    useEffect(() => {
        // Fungsi untuk cek status ke server
        const checkStatus = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/auth/reset-status/${identifier}`);
                const data = await res.json();
                if (data.approved) {
                    setIsApproved(true);
                }
            } catch (error) {
                console.error("Cek status gagal", error);
            }
        };

        // Polling: Jalankan setiap 3 detik
        const interval = setInterval(() => {
            if (!isApproved) checkStatus();
        }, 3000);

        return () => clearInterval(interval);
    }, [identifier, isApproved]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md text-center border border-gray-100">
                {!isApproved ? (
                    <>
                        <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Menunggu Persetujuan</h2>
                        <p className="text-gray-500 text-sm">Permintaan ganti password kamu sedang diproses oleh Admin. Jangan tutup halaman ini.</p>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Diganti!</h2>
                        <p className="text-gray-500 text-sm mb-8">Admin telah menyetujui permintaanmu. Sekarang kamu bisa login dengan password baru.</p>
                        <button 
                            onClick={() => navigate('/login-user')}
                            className="w-full bg-[#4e8a68] text-white font-bold py-3 rounded-full shadow-lg"
                        >
                            Kembali Ke Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default WaitingReset;