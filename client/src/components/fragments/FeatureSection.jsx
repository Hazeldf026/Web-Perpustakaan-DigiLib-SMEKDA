import LibraryShelf from "../../assets/library-shelf.png"
import Literasi from "../../assets/literasi-sekolah.jpg"
import Badge from "../../assets/badge.png"
import Window from "../../assets/window.png"
import Future from "../../assets/Future.png"

const FeatureSection = () => {

    const cards = [
        {
            title: "Penunjang Prestasi",
            desc: "Buku adalah kunci nilai bagus. Membantu mengerjakan tugas, laporan PKL, dan ujian",
            icon: Badge,
        },
        {
            title: "Jendela Dunia",
            desc: "Membuka wawasan di luar tembok sekolah. Mengetahui perkembangan teknologi dan dunia luar.",
            icon: Window,
        },
        {
            title: "Bekal Masa Depan",
            desc: "Literasi adalah skill dasar di dunia kerja. Membaca meningkatkan kemampuan komunikasi dan analisis.",
            icon: Future,
        },
    ]

    return (
        <div className="overflow-hidden bg-gray-50 space-y-32 py-40">
        
            <div className="space-y-32 mb-52">
                {/* === ITEM 1: GAMBAR KIRI, HIJAU KANAN MENTOK === */}
                <div className="relative w-full flex items-center">
                    
                    {/* 1. BACKGROUND HIJAU (Absolute agar mentok kanan) */}
                    <div className="absolute right-0 -top-5 -bottom-5 w-[85%] md:w-[75%] bg-green-800 z-0"></div>

                    {/* 2. CONTAINER KONTEN (Agar gambar & teks rapi di tengah) */}
                    <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
                    
                    {/* Gambar (Floating, lebih kecil dari background, shadow besar) */}
                    <div className="w-full md:w-4/16 mb-8 md:mb-0">
                        <img 
                        src={LibraryShelf}
                        alt="Rak Buku" 
                        className="w-full h-auto rounded-2xl shadow-2xl object-cover aspect-4/5" 
                        />
                    </div>

                    {/* Teks (Di dalam area hijau) */}
                    <div className="w-full md:w-7/12 md:pl-16 text-white">
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">
                        Jantung Referensi Akademik
                        </h2>
                        <p className="text-xl leading-relaxed opacity-90">
                        Menjadi pusat sumber belajar utama yang menyediakan 
                        ribuan koleksi buku pelajaran, modul produktif, dan referensi umum 
                        untuk mendukung pencapaian kompetensi siswa di setiap jurusan.
                        </p>
                    </div>

                    </div>
                </div>


                {/* === ITEM 2: GAMBAR KANAN, HIJAU KIRI MENTOK (ZIG-ZAG) === */}
                <div className="relative w-full flex items-center">
                    
                    {/* 1. BACKGROUND HIJAU */}
                    <div className="absolute left-0 -top-5 -bottom-5 w-[85%] md:w-[75%] bg-green-800 z-0"></div>

                    {/* 2. CONTAINER KONTEN */}
                    <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row-reverse items-center">
                    
                    {/* Gambar */}
                    <div className="w-full md:w-4/16 mb-8 md:mb-0">
                        <img 
                        src={Literasi} 
                        alt="Siswa Membaca" 
                        className="w-full h-auto rounded-2xl shadow-2xl object-cover aspect-4/5" 
                        />
                    </div>

                    {/* Teks */}
                    <div className="w-full md:w-7/12 md:pr-16 md:text-left text-white">
                        <h2 className="text-4xl md:text-5xl font-bold mb-2 text-right">
                        Inkubator Literasi & Karakter
                        </h2>
                        <p className="text-xl leading-relaxed opacity-90 text-right">
                        Membangun ekosistem literasi yang nyaman dan inklusif. 
                        Kami hadir untuk menumbuhkan minat baca serta membentuk karakter 
                        siswa yang kritis, kreatif, dan berwawasan global.
                        </p>
                    </div>

                    </div>
                </div>
            </div>

            {/* cards */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {cards.map((card, index) => (
                        <div
                        key={index}
                        className="bg-white rounded-4xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-center border border-gray-100 hover:shadow-2xl transition-all duration-300"
                        >
                            {/* icon container */}
                            <div className="h-54 flex items-center justify-center mb-4">
                                <img src={card.icon} alt={card.title} className="h-30 object-contain" />
                            </div>
                            {/* title */}
                            <h3 className="text-xl font-black text-gray-900 mb-3">
                                {card.title}
                            </h3>
                            {/* description */}
                            <p className="text-gray-500 text-sm leading-relaxed px-2"> 
                                {card.desc}
                            </p>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    )
}

export default FeatureSection