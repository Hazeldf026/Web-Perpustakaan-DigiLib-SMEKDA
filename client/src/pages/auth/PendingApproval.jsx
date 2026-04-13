import React from 'react';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;
        
        const user = JSON.parse(localStorage.getItem('temp_user_data')); 
        socket.emit("join_room", user.identifier);

        socket.on("account_status", (data) => {
            if (data.approved) {
                toast.success("Akun di-ACC! Mengalihkan...");
                setTimeout(() => navigate('/login-user'), 2000);
            }
        });

        return () => socket.off("account_status");
    }, [socket, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] font-sans p-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full text-center border border-gray-100">
                {/* Ikon Jam Pasir / Waktu */}
                <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Pendaftaran Berhasil!</h2>
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium mb-8">
                    Akun kamu telah masuk ke sistem kami. Saat ini, status akunmu sedang <strong>Menunggu Persetujuan (ACC)</strong> dari Administrator Perpustakaan.
                </div>
                
                <p className="text-gray-500 text-sm mb-8">
                    Kamu baru bisa melakukan proses Login setelah Admin menyetujui pendaftaranmu. Silakan cek kembali secara berkala.
                </p>

                <Link 
                    to="/login-user" 
                    className="block w-full bg-[#4e8a68] text-white font-bold py-4 rounded-full hover:bg-green-800 transition shadow-lg hover:-translate-y-1 transform"
                >
                    Kembali ke Halaman Login
                </Link>
            </div>
        </div>
    );
};

export default PendingApproval;