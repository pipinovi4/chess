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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameService_1 = __importDefault(require("../services/gameService"));
const gameSocket = (server) => {
    const onConnection = (socket) => {
        console.log(`User with id ${socket.id} connected`);
        socket.on('create-game', () => __awaiter(void 0, void 0, void 0, function* () {
            const usersSocketId = [];
            usersSocketId.push(socket.id);
            if (usersSocketId.length === 2) {
                const gameId = yield gameService_1.default.createGame(usersSocketId);
                localStorage.setItem('gameId', gameId.toString());
                socket.emit('game-created', gameId.toString());
            }
        }));
        socket.on('move', (move, gameId) => __awaiter(void 0, void 0, void 0, function* () {
            const game = yield gameService_1.default.updateMovesGame(move, gameId);
            const recipientUser = game.users.find((usersSocketId) => usersSocketId !== socket.id);
            socket.to(recipientUser[0]).emit('opponentMove');
        }));
        socket.on('end-game', (status, gameId) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Game ended diferences`);
            yield gameService_1.default.endGame(status, socket.id, gameId);
        }));
    };
    server.on('connection', onConnection);
};
exports.default = gameSocket;
