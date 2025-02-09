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
    socket.on("joinFamily", (data) => {
        const familyId = Number(data);
        if (!familyId) {
            console.error("ID de la famille manquant ou invalide");
            return;
        }
        socket.join(familyId.toString());
        console.log(`Socket ${familyId} a rejoint la famille : ${familyId}`);
        // Vérifiez les sockets dans la room
        const socketsInRoom = io.sockets.adapter.rooms.get(familyId.toString());
        console.log(`Sockets dans la room ${familyId}:`, socketsInRoom ? Array.from(socketsInRoom) : []);
        // Confirmation au client
        socket.emit("joinedFamily", { familyId });
    });
    socket.on("sendMessage", (data) => {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        const { familyId, senderId, senderNom, senderPrenom, content } = data;
        if (!familyId || !senderId || !content || !senderNom || !senderPrenom) {
            console.error("Données de message invalides");
            return;
        }
        console.log(`Message reçu : ${content} de ${senderId} ${senderPrenom + senderNom} pour la famille ${familyId}`);
        socket.broadcast.to(familyId.toString()).emit("message", { senderId, senderNom, senderPrenom, content });
    });
});
console.log("Serveur WebSocket en cours d'exécution...");
