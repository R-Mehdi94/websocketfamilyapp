import express from "express";
import { Server } from "socket.io";
import http from "http";

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

        socket.data.chatId = chatId; // Stocker l'ID du chat dans socket.data
        socket.join(chatId.toString());
        console.log(`Socket ${socket.id} a rejoint le chat : ${chatId}`);

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

        const { senderId, senderNom, senderPrenom, content } = data;
        const chatId = socket.data.chatId; 

        if (!chatId || !senderId || !content || !senderNom || !senderPrenom) {
            console.error("Données de message invalides");
            return;
        }

        console.log(`Message reçu : ${content} de ${senderId} ${senderPrenom + senderNom} pour le chat ${chatId}`);
        
        socket.broadcast.to(chatId.toString()).emit("message", { senderId, senderNom, senderPrenom, chatId, content });
    });
});

console.log("Serveur WebSocket en cours d'exécution...");
