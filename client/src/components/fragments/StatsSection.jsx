const StatsSection = () => {
    return (
        <div className="relative my-5 z-20 max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-full shadow-xl py-8 px-12 flex felx-col md:flex-row justify-between items-center text-center">
                <div>
                    <h3 className="text-3xl font-bold text-gray-800">1,000+</h3>
                    <p className="text-gray-500">Koleksi Buku</p>
                </div>
                <div className="w-full md:w-px h-0 md:h-12 bg-gray-200 my-4 md:my-0"></div>
                <div>
                    <h3 className="text-3xl font-bold text-gray-800">8</h3>
                    <p className="text-gray-500">Jurusan Terlayani</p>
                </div>
                <div className="w-full md:w-px h-0 md:h-12 bg-gray-200 my-4 md:my-0"></div>
                <div>
                    <h3 className="text-3xl font-bold text-gray-800">500</h3>
                    <p className="text-gray-500">Anggota Aktif</p>
                </div>
            </div>
        </div>
    )
}

export default StatsSection