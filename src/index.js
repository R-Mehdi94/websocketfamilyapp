"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocket = void 0;
const express = require("express");
const socketIO = require("socket.io");
const PORT = 3000;
const websocket = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = express().listen(PORT, () => {
        console.log(`Ws écoute sur le port ${PORT}`);
    });
    const socketHandler = socketIO(server);
    socketHandler.on("connection", (socket) => {
        console.log("Nouvelle connexion WebSocket établie");
        socket.on("error", (err) => {
            console.error(`Erreur WebSocket : ${err.message}`);
        });
        socket.on("disconnect", () => {
            console.log("Un utilisateur s'est déconnecté");
        });
        socket.on("joinFamily", (familyId) => {
            if (!familyId) {
                console.error("ID de la famille manquant");
                return;
            }
            socket.join(familyId);
            console.log(`Utilisateur rejoint la famille : ${familyId}`);
        });
        socket.on("sendMessage", (data) => {
            const { familyId, senderId, content } = data;
            console.log(`Message reçu : ${content} de ${senderId} pour la famille ${familyId}`);
            socket.emit("message", { "test": "test" });
        });
        socket.on("message", (data) => {
            console.log(`Message reçu : ${data}`);
            socket.emit("message", { "test": "test" });
            console.log("message test envoyé");
        });
    });
    (0, exports.websocket)();
});
exports.websocket = websocket;
