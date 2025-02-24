"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const PORT = 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
server.listen(PORT, () => {
    console.log(`WebSocket écoute sur le port ${PORT}`);
});
io.on("connection", (socket) => {
    console.log(`Nouvelle connexion : ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`Socket déconnecté : ${socket.id}`);
    });
    socket.on("joinChat", (data) => {
        const chatId = Number(data);
        if (!chatId) {
            console.error("ID du chat manquant ou invalide");
            return;
        }
        socket.join(chatId.toString());
        console.log(`Socket ${chatId} a rejoint le chat : ${chatId}`);
        // Vérifiez les sockets dans la room
        const socketsInRoom = io.sockets.adapter.rooms.get(chatId.toString());
        console.log(`Sockets dans la room ${chatId}:`, socketsInRoom ? Array.from(socketsInRoom) : []);
        // Confirmation au client
        socket.emit("joinedChat", { chatId });
    });
    socket.on("sendMessage", (data) => {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        const { chatId, senderId, senderNom, senderPrenom, content } = data;
        if (!chatId || !senderId || !content || !senderNom || !chatId || !senderPrenom) {
            console.error("Données de message invalides");
            return;
        }
        console.log(`Message reçu : ${content} de ${senderId} ${senderPrenom + senderNom} pour le chat ${chatId}`);
        socket.broadcast.to(chatId.toString()).emit("message", { senderId, senderNom, chatId, senderPrenom, content });
    });
});
console.log("Serveur WebSocket en cours d'exécution...");
