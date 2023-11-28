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
const QueueModel_1 = __importDefault(require("../../models/customModels/QueueModel"));
const GameModel_1 = __importDefault(require("../../models/DB/GameModel"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const uuid = __importStar(require("uuid"));
const QUEUE_MODEL = new QueueModel_1.default();
class OnlineGameService {
    async startOnlineGame(server, socket) {
        try {
            const opponent = await QUEUE_MODEL.findMatchingPlayer(socket);
            if (opponent) {
                const newGame = await GameModel_1.default.create({
                    users: [socket.id, opponent],
                    status: 'active',
                });
                if (newGame) {
                    const roomId = uuid.v4();
                    const gameId = newGame._id;
                    const opponentSocket = server.sockets.get(opponent);
                    if (opponentSocket) {
                        await opponentSocket.receiveGameData(roomId, gameId);
                        socket.receiveGameData(roomId, gameId);
                        server
                            .to(roomId)
                            .emit('online-game-started', [opponent, socket.id]);
                    }
                    else {
                        throw new Error('Opponent socket not found');
                    }
                }
                else {
                    throw ApiError_1.default.BadRequest('Connection lost during player connection and game creation');
                }
            }
            else {
                QUEUE_MODEL.addToQueue(socket.id);
                return new Promise((resolve) => {
                    const checkIsMatchMaking = () => {
                        if (socket.isMatchMaking) {
                            resolve();
                        }
                        else {
                            setTimeout(checkIsMatchMaking, 100);
                        }
                    };
                    checkIsMatchMaking();
                });
            }
        }
        catch (error) {
            throw ApiError_1.default.BadRequest('Error when attempting to connect players', error);
        }
    }
    async stopGame(roomId, gameId, socket, server) {
        server.to(roomId).disconnectSockets(true);
        socket.disconnect(true);
        const game = await GameModel_1.default.findById(gameId);
        if (game) {
            game.status = 'finished';
            await game.save();
            socket.emit('online-game-stopped');
        }
        else {
            console.error('Game was not found in database when updating the game status to "finished"');
        }
    }
    async updateDatabaseMoves(move, gameId) {
        try {
            const game = await GameModel_1.default.findById(gameId);
            if (!game) {
                throw ApiError_1.default.BadRequest('When trying to update a move in the database, the game appeared undefined');
            }
            game.moves.push(move);
            console.log(game.moves);
            await game.save();
        }
        catch (error) {
            throw ApiError_1.default.UnforeseenError('When trying to update moves in the database', error);
        }
    }
}
exports.default = OnlineGameService;
