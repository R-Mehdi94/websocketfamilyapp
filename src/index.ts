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
    console.log("Nouvelle connexion WebSocket établie");

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });

    socket.on("joinFamily", (data) => {
        const familyId = Number(data);
        if (!familyId) {
            console.error("ID de la famille manquant ou invalide");
            return;
        }
        socket.join(familyId.toString());
        console.log(`Utilisateur rejoint la famille : ${familyId}`);
    });

    socket.on("sendMessage", (data) => {
        const { familyId, senderId, content } = data;
        if (!familyId || !senderId || !content) {
            console.error("Données de message invalides");
            return;
        }
        console.log(`Message reçu : ${content} de ${senderId} pour la famille ${familyId}`);
        io.to(familyId.toString()).emit("message", { senderId, content });
    });

    socket.on("message", (data) => {
        console.log(`Message reçu : ${data}`);
        socket.emit("message", { test: "test" });
        console.log("Message test envoyé");
    });
});

console.log("Serveur WebSocket en cours d'exécution...");
