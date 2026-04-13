import { prisma } from  "../src/config/db.js";

async function main() {
    // Daftar genre yang akan dimasukkan ke database
    const genres = [
        "Fiksi",
        "Non-Fiksi",
        "Teknologi",
        "Sains",
        "Sejarah",
        "Budaya",
        "Biografi",
        "Tokoh",
        "Fantasi",
        "Sci-Fi",
        "Misteri",
        "Horor",
        "Thriller",
        "Komik",
        "Manga",
        "Agama",
        "Spiritual",
        "Pengembangan Diri",
        "Pendidikan",
        "Sastra Klasik",
        "Puisi",
        "Drama",
        "Ensiklopedia"
    ];

    console.log("Memulai proses seeding genre... ⏳");

    for (const genreName of genres) {
        await prisma.genre.upsert({
            where: { name: genreName },
            update: {},
            create: { name: genreName }
        });
    }

    console.log("Seeding genre berhasil diselesaikan! 🚀");
}

main()
    .catch((e) => {
        console.error("Terjadi kesalahan saat seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });