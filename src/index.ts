import express from "express";
import { Server } from "socket.io";
import http from "http";
import { send } from "process";

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

        const { familyId, senderId, content } = data;
        if (!familyId || !senderId || !content) {
            console.error("Données de message invalides");
            return;
        }

        console.log(`Message reçu : ${content} de ${senderId} pour la famille ${familyId}`);
        
        socket.broadcast.to(familyId.toString()).emit("message", { senderId, content });
    });
});


console.log("Serveur WebSocket en cours d'exécution...");
