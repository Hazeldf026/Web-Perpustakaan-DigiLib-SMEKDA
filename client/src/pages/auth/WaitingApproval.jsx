import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { Check, Hourglass, X } from 'lucide-react';

const WaitingApproval = () => {
    const { identifier } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    
    const [status, setStatus] = useState('pending'); // 'pending' | 'approved' | 'rejected'

    useEffect(() => {
        if (!socket) return;
        socket.emit("join_room", identifier);

        socket.on("account_status", (data) => {
            if (data.approved) setStatus('approved');
            if (data.rejected) setStatus('rejected');
        });

        // Polling Fallback
        const checkStatus = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/auth/registration-status/${identifier}`);
                if (res.status === 404) {
                    // Jika 404 (User tidak ditemukan), berarti Admin telah MENOLAK dan MENGHAPUS pendaftarannya
                    setStatus('rejected');
                } else if (res.ok) {
                    const data = await res.json();
                    if (data.approved) setStatus('approved');
                }
            } catch (error) { console.error(error); }
        };

        const interval = setInterval(() => {
            if (status === 'pending') checkStatus();
        }, 3000);

        return () => { socket.off("account_status"); clearInterval(interval); };
    }, [socket, identifier, status]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md text-center border border-gray-100">
                {status === 'pending' && (
                    <>
                        <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-inner"><Hourglass /></div>
                        <h2 className="text-2xl font-black text-gray-800 mb-4">Verifikasi Akun</h2>
                        <p className="text-gray-500 text-sm">Menunggu persetujuan Admin...</p>
                    </>
                )}
                
                {status === 'approved' && (
                    <>
                        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><Check size={36} /></div>
                        <h2 className="text-2xl font-black text-gray-800 mb-4">Akun Aktif!</h2>
                        <p className="text-gray-500 text-sm mb-8">Akunmu telah dibuat. Sekarang kamu bisa login dengan akun yang telah dibuat.</p>
                        <button onClick={() => navigate('/login-user')} className="w-full bg-green-800 text-white font-bold py-4 rounded-full shadow-lg hover:bg-green-900 transition">Masuk Sekarang</button>
                    </>
                )}

                {status === 'rejected' && (
                    <>
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><X size={34} /></div>
                        <h2 className="text-2xl font-black text-gray-800 mb-4">Pendaftaran Ditolak</h2>
                        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm font-medium mb-6">
                            Maaf, Admin menolak permintaan pendaftaranmu. Pastikan NIS/NIP dan nama yang dimasukkan valid sesuai data sekolah.
                        </div>
                        <Link to="/register-user" className="block w-full bg-red-500 text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-700 transition">Daftar Ulang</Link>
                    </>
                )}
            </div>
        </div>
    );
};
export default WaitingApproval;