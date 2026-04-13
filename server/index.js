import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/authRoutes.js";
import { verifyToken, isAdmin } from "./src/middleware/authMiddleware.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import genreRoutes from "./src/routes/genreRoutes.js";
import favoriteRoutes from "./src/routes/favoriteRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import userTransactionRoutes from "./src/routes/userTransactionRoutes.js";

// 1. Load env vars
dotenv.config();

// 2. Inisialisasi App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // URL Vite
        methods: ["GET", "POST", "PUT"]
    }
});

// Buat io dapat diakses di controller
app.set("io", io);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User bisa "join" ke room berdasarkan ID mereka agar dapat notif pribadi
    socket.on("join_room", (userId) => {
        socket.join(userId);
    });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors()); 
app.use(express.json()); 

// 4. Test Route
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/my-transactions", userTransactionRoutes);

app.get("/api/profil-saya", verifyToken, (req, res) => {
    // req.user ini didapat dari hasil kerja satpam verifyToken
    res.json({ message: "Selamat datang di profilmu!", user: req.user });
});

app.get("/api/data-rahasia-admin", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Selamat datang, Paduka Admin. Ini data rahasianya." });
});

app.get("/", (req, res) => {
  res.send("Server DigiLab SMEKDA is Running!");
});

// 5. Jalankan Server
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});