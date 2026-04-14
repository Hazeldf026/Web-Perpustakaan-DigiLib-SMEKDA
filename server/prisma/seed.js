import { prisma } from  "../src/config/db.js";
import bcrypt from 'bcryptjs'; // <--- IMPORT INI UNTUK HASHING PASSWORD

const prisma = new PrismaClient();

async function main() {
    // ==========================================
    // 1. DATA USER (ADMIN & MEMBER)
    // ==========================================
    console.log("Memulai proses seeding user... ⏳");

    // Hash password sebelum dimasukkan ke database
    const adminPassword = await bcrypt.hash('hdf_4295', 10);
    const memberPassword = await bcrypt.hash('hdf_110208', 10);

    const usersData = [
        {
            identifier: '0', // Berdasarkan gambar, Admin memakai identifier 0
            name: 'Hazel Dide Febrano',
            email: 'hazeldf11@gmail.com',
            password: adminPassword,
            role: 'ADMIN',
            isApproved: true // 1 di database
        },
        {
            identifier: '0088293500', // Sesuai dengan gambar
            name: 'Hazel Dide Febrano',
            email: 'hazeldf02@gmail.com',
            password: memberPassword,
            role: 'MEMBER',
            isApproved: true // 1 di database
        }
    ];

    for (const user of usersData) {
        await prisma.user.upsert({
            where: { identifier: user.identifier },
            update: {
                // Update password dan email jika ada perubahan di skrip ini
                password: user.password,
                email: user.email,
                name: user.name,
                isApproved: user.isApproved
            },
            create: {
                identifier: user.identifier,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                isApproved: user.isApproved
            }
        });
    }
    console.log("✅ Seeding user berhasil diselesaikan!");


    // ==========================================
    // 2. DATA GENRE
    // ==========================================
    const genresData = [
        { id: 1, name: "Fiksi" }, { id: 2, name: "Non-Fiksi" }, { id: 3, name: "Teknologi" },
        { id: 4, name: "Sains" }, { id: 5, name: "Sejarah" }, { id: 6, name: "Budaya" },
        { id: 7, name: "Biografi" }, { id: 8, name: "Tokoh" }, { id: 9, name: "Fantasi" },
        { id: 10, name: "Sci-Fi" }, { id: 11, name: "Misteri" }, { id: 12, name: "Horor" },
        { id: 13, name: "Thriller" }, { id: 14, name: "Komik" }, { id: 15, name: "Manga" },
        { id: 16, name: "Agama" }, { id: 17, name: "Spiritual" }, { id: 18, name: "Pengembangan Diri" },
        { id: 19, name: "Pendidikan" }, { id: 20, name: "Sastra Klasik" }, { id: 21, name: "Puisi" },
        { id: 22, name: "Drama" }, { id: 23, name: "Ensiklopedia" }
    ];

    console.log("Memulai proses seeding genre... ⏳");

    for (const genre of genresData) {
        await prisma.genre.upsert({
            where: { id: genre.id }, 
            update: { name: genre.name }, 
            create: { id: genre.id, name: genre.name }
        });
    }
    console.log("✅ Seeding genre berhasil diselesaikan!");


    // ==========================================
    // 3. DATA BUKU DAN RELASI (_booktogenre)
    // ==========================================
    const booksData = [
        {
            bookCode: 'AA-001',
            title: 'Peta Jiwa: Self-Healing Islami untuk Overthinking',
            author: 'Ummu Balqis',
            publisher: 'Elex Media Komputindo',
            coverImage: '1775715322523-109370710.jpg',
            synopsis: `'Di saat kita berada di titik terendah dalam hidup, seringkali overthinking menghampiri. Buku ini menyajikan self-healing...'`,
            stock: 10,
            isRecommended: true,
            genreIds: [2, 16, 17]
        },
        {
            bookCode: 'AA-002',
            title: 'Melewati Batas: Bergoglio, Seorang Pemberani yang Membawa Perubahan',
            author: 'Alexander Yopi',
            publisher: 'Penerbit One Peach Media',
            coverImage: '1775715581962-817621151.jpg',
            synopsis: 'Tokoh dunia yang bernama Paus Fransiskus itu, semasa hidupnya selalu berani melewati batas untuk...',
            stock: 10,
            isRecommended: false,
            genreIds: [2, 7, 16]
        },
        {
            bookCode: 'AA-003',
            title: 'Proyek Hail Mary (Project Hail Mary)',
            author: 'Andy Weir',
            publisher: 'Gramedia Pustaka Utama',
            coverImage: '1775715768596-381495555.jpg',
            synopsis: 'Ryland Grace adalah satu-satunya orang yang masih hidup dalam misi luar angkasa keputusasaan terakhir...',
            stock: 10,
            isRecommended: true,
            genreIds: [1, 3, 10]
        },
        {
            bookCode: 'AA-004',
            title: 'Kultivator Dewa Xiao Wang',
            author: 'Rahmat Kurniawan',
            publisher: 'm&c!',
            coverImage: '1775715985890-534355190.jpg',
            synopsis: 'Xiao Wang lahir dengan mimpi besar: berdiri di puncak dunia kultivasi dan melindungi semua yang berharga...',
            stock: 9,
            isRecommended: false,
            genreIds: [1, 9]
        },
        {
            bookCode: 'AA-005',
            title: 'Sejarah Filsafat Timur',
            author: 'L. Adams Beck',
            publisher: 'Anak Hebat Indonesia',
            coverImage: '1775716113706-135209894.jpg',
            synopsis: 'Sejarah Filsafat Timur: Menelusuri Akar-Akar Pemikiran dari tradisi kuno Tiongkok, India, hingga Timur Tengah...',
            stock: 10,
            isRecommended: true,
            genreIds: [2, 18, 19]
        },
        {
            bookCode: 'AA-006',
            title: 'Dalam Bayang-Bayang Lenin (2025)',
            author: 'Franz Magnis-Suseno, S.J.',
            publisher: 'Gramedia Pustaka Utama',
            coverImage: '1775716212155-474665979.jpg',
            synopsis: 'Selama tiga perempat abad, komunisme menjadi salah satu kekuatan politik dan ideologi terbesar dunia...',
            stock: 10,
            isRecommended: true,
            genreIds: [2, 5, 8, 19]
        },
        {
            bookCode: 'AA-007',
            title: 'KUHP Edisi Terbaru & Terlengkap',
            author: 'Tim Adhyaksa',
            publisher: 'Moka Media',
            coverImage: '1775716353154-373855474.jpg',
            synopsis: 'Buku ini menyajikan kumpulan lengkap Kitab Undang-Undang Hukum Pidana dengan pasal-pasal terbaru...',
            stock: 10,
            isRecommended: false,
            genreIds: [2, 19, 23]
        },
        {
            bookCode: 'AA-008',
            title: 'Ekologi Pangan dan Gizi',
            author: 'Eva Ellya Sibagariang, SKM., M.Kes, dkk.',
            publisher: 'Trans Info Media',
            coverImage: '1775716458306-648054661.jpg',
            synopsis: 'Materi yang dibahas dalam buku ini meliputi: Bab 1 Pendahuluan Ekologi, Bab 2 Pangan dan Gizi Manusia...',
            stock: 10,
            isRecommended: false,
            genreIds: [2, 19]
        },
        {
            bookCode: 'AA-009',
            title: 'Seri Misteri Favorit: Misteri Taman Berhantu',
            author: 'Fita Chakra',
            publisher: 'Kepustakaan Populer Gramedia',
            coverImage: '1776092882455-240659394.jpg',
            synopsis: '"Kalian harus segera pergi dari taman ini. Ada hantu yang akan datang..." seru si penjaga tua misterius.',
            stock: 10,
            isRecommended: false,
            genreIds: [1, 11]
        }
    ];

    console.log("Memulai proses seeding buku... ⏳");

    for (const book of booksData) {
        await prisma.book.upsert({
            where: { bookCode: book.bookCode },
            update: {
                title: book.title,
                stock: book.stock,
                isRecommended: book.isRecommended,
                genres: {
                    set: [], 
                    connect: book.genreIds.map(id => ({ id: id })) 
                }
            }, 
            create: {
                bookCode: book.bookCode,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                coverImage: book.coverImage,
                synopsis: book.synopsis,
                stock: book.stock,
                isRecommended: book.isRecommended,
                genres: {
                    connect: book.genreIds.map(id => ({ id: id })) 
                }
            }
        });
    }
    
    console.log('✅ Seeding 9 buku beserta relasi genrenya berhasil diselesaikan!');
    console.log('🎉 SELURUH PROSES SEEDING SELESAI 🎉');
}

main()
    .catch((e) => {
        console.error("Terjadi kesalahan saat seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });