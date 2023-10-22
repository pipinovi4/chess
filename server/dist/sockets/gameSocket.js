"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameService_1 = __importDefault(require("../services/GameServices/gameService"));
const gameSocket = (server) => {
    const onConnection = (socket) => {
        console.log(`User with id ${socket.id} connected`);
        socket.on('create-game', async () => {
            const usersSocketId = [];
            usersSocketId.push(socket.id);
            if (usersSocketId.length === 2) {
                const gameId = await gameService_1.default.createGame(usersSocketId);
                localStorage.setItem('gameId', gameId.toString());
                socket.emit('game-created', gameId.toString());
            }
        });
        socket.on('move', async (move, gameId) => {
            const game = await gameService_1.default.updateMovesGame(move, gameId);
            const recipientUser = game.users.find((usersSocketId) => usersSocketId !== socket.id);
            socket.to(recipientUser[0]).emit('opponentMove');
        });
        socket.on('end-game', async (status, gameId) => {
            console.log(`Game ended diferences`);
            await gameService_1.default.endGame(status, socket.id, gameId);
        });
    };
    server.on('connection', onConnection);
};
exports.default = gameSocket;
