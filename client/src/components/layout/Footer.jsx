const Footer = () => {
    return (
        <footer className="bg-green-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
        
                {/* === GRID UTAMA (4 KOLOM) === */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                
                {/* KOLOM 1: BRANDING & DESKRIPSI */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">DigiLab SMEKDA</h3>
                    <p className="text-white/90 leading-relaxed text-sm">
                    Sistem informasi perpustakaan digital SMKN 2 Purwakarta. 
                    Mengintegrasikan layanan sirkulasi dan pengelolaan katalog buku 
                    untuk mempermudah akses literasi seluruh warga sekolah secara 
                    efisien dan transparan.
                    </p>
                </div>

                {/* KOLOM 2: JAM LAYANAN */}
                <div>
                    <h3 className="text-xl font-bold mb-6">Jam Layanan</h3>
                    <ul className="space-y-4 text-white/90 text-sm">
                    <li>
                        <span className="block font-semibold">Senin - Kamis:</span>
                        07.00 - 15.00 WIB
                    </li>
                    <li>
                        <span className="block font-semibold">Jumat:</span>
                        07.00 - 11.30 WIB
                    </li>
                    <li>
                        <span className="block font-semibold">Sabtu - Minggu:</span>
                        Tutup
                    </li>
                    <li>
                        <span className="block font-semibold">Istirahat:</span>
                        12.00 - 13.00 WIB
                    </li>
                    </ul>
                </div>

                {/* KOLOM 3: KONTAK SEKOLAH */}
                <div>
                    <h3 className="text-xl font-bold mb-6">Kontak Sekolah</h3>
                    <ul className="space-y-4 text-white/90 text-sm">
                    {/* Lokasi */}
                    <li className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>SMK Negeri 2 Purwakarta</span>
                    </li>
                    
                    {/* Telepon */}
                    <li className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>0812-3456-7890</span>
                    </li>

                    {/* Email */}
                    <li className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        <span>digilabsmekda@gmail.com</span>
                    </li>
                    </ul>
                </div>

                {/* KOLOM 4: SOCIAL MEDIA */}
                <div>
                    <h3 className="text-xl font-bold mb-6">Social Media</h3>
                    <div className="flex gap-4">
                    {/* Instagram */}
                    <a href="#" className="bg-white/20 p-3 rounded-full hover:bg-white hover:text-[#528f6e] transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>

                    {/* Facebook */}
                    <a href="#" className="bg-white/20 p-3 rounded-full hover:bg-white hover:text-[#528f6e] transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                    </div>
                </div>

                </div>

                {/* === GARIS PEMBATAS & COPYRIGHT === */}
                <div className="border-t border-white/20 pt-8 text-center">
                <p className="text-white/80 text-sm">
                    &copy; 2026 DigiLab SMKN 2 Purwakarta. All rights reserved.
                </p>
                </div>

            </div>
        </footer>
    )
}

export default Footer