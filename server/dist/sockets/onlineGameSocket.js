"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueueModel_1 = __importDefault(require("../models/QueueModel"));
const uuid = __importStar(require("uuid"));
const QUEUE = new QueueModel_1.default();
const onlineGameSocket = (server) => {
    const onConnection = (socket) => {
        let roomId;
        socket.on('start-online-game', async () => {
            QUEUE.addToQueue(socket.id);
            const matchingPlayer = await QUEUE.findMatchingPlayer(socket.id);
            if (matchingPlayer) {
                roomId = uuid.v4();
                socket.join(roomId);
                socket.emit(`matching-player-${matchingPlayer}`, matchingPlayer, roomId);
                socket.on('connected-user', () => {
                    socket.emit('game-started');
                });
            }
            else {
                socket.once(`matching-player-${socket.id}`, (player, roomId) => {
                    socket.join(roomId);
                    socket.to(roomId).emit(`conected-user`);
                    socket.emit('game-started');
                });
            }
            socket.on('send-move-opponent', (move) => {
                if (move) {
                    socket.emit('move-opponent', move);
                }
                else {
                    console.error('Nikita lox');
                }
            });
        });
        socket.on('send-move', (move) => {
            socket.to(roomId).emit('send-move-opponent', move);
        });
        socket.on('game-end', () => {
            socket.leave(roomId);
            socket.removeAllListeners();
        });
        socket.on('close', () => {
            console.log('Socket connection lost');
        });
    };
    server.on('connection', onConnection);
};
exports.default = onlineGameSocket;
