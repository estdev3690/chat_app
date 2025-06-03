import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/mongoDB.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { setupSocket } from "./socket/socketHandlers.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://chat-app-teal-psi.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://chat-app-teal-psi.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

// Socket.io Setup
setupSocket(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
