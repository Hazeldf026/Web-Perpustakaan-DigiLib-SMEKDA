import { useState, useEffect } from "react";
import BackgroundImage from "../../assets/library1.jpeg"
import LogoPutih from "../../assets/LogoPutih.png"
import { Link } from "react-router-dom";

const HeroSection = () => {

    const [scrollPos, setScrollPos] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollPos(window.scrollY)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    //logika perhitungan transformasi, semakin di scroll semakin kecil
    const isScrolled = scrollPos > 50

    return (
        <div className="w-full h-[120vh] bg-gray-50 flex flex-col items-center pt-0">

            {/* container gambar utama */}
            <div
                className={`relative transition-all duration-700 ease-in-out bg-cover bg-center flex felx-col justify-center items-center text-center text-white overflow-hidden shadow-2xl
                    ${isScrolled
                    ? "w-[90%] h-[80%] rounded-[3rem] mt-10" //state scrolled (mengecil)
                    : "w-full h-screen rounded-none mt-0" //state awal(fullscreen)
                    }
                `}
                style={{
                    backgroundImage: `url(${BackgroundImage})`,
                }}
            >
                {/* overlay gelap */}
                <div className="absolute inset-0 bg-black/50 z-0"></div>

                {/* logo */}
                <div className="absolute top-8 left-8 z-20">
                    <img src={LogoPutih} alt="Logo" className="h-8 md:h-10 opacity-80" />
                </div>


                {/* konten text */}
                <div className="relative z-10 max-w-4xl px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-2">
                        PUSAT LITERASI, REFERENSI AKADEMIK
                        DAN SUMBER BELAJAR TERPADU SMKN 2 PURWAKARTA
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Menyediakan akses langsung ke seluruh katalog perpustakaan sekolah. Temukan buku pelajaran, modul kejuruan produktif, hingga bacaan umum, serta kelola aktivitas peminjaman dan pengembalian Anda dengan sistem pendataan yang transparan dan terstruktur.
                    </p>

                    <div className="flex flex-col md:flex-row gap-12 justify-center"> 
                        <Link to="/login-admin" className="group relative bg-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:bg-transparent boder-2 border-white overflow-hidden">
                            <span className="bg-inherit text-transparent bg-clip-text bg-fixed group-hover:text-white transition-colors duration-300"
                                    style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                Masuk Admin
                            </span>
                        </Link>
                        <Link to="/login-user" className="group relative bg-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:bg-transparent boder-2 border-white overflow-hidden">
                            <span className="bg-inherit text-transparent bg-clip-text bg-fixed group-hover:text-white transition-colors duration-300"
                                    style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                Masuk User
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroSection