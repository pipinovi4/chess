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
const uuid = __importStar(require("uuid"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const QUEUE_MODEL = new QueueModel_1.default();
class OnlineGameService {
    queue;
    constructor() {
        this.queue = QUEUE_MODEL;
    }
    async startOnlineGame(player, server, socket) {
        try {
            this.queue.addToQueue(player);
            const roomId = uuid.v4();
            const opponent = await this.queue.findMatchingPlayer(socket);
            if (!opponent) {
                throw new Error('Error when trying to get players found in the queue search');
            }
            for (const player of opponent) {
                server.to(player).socketsJoin(roomId);
                this.queue.removeFromQueue(player);
            }
            const gameModel = await GameModel_1.default.create({
                status: 'active',
                users: [player, opponent[0]],
            });
            if (!gameModel) {
                throw ApiError_1.default.BadRequest('Game model was not created');
            }
            return { gameId: gameModel._id, players: [player, opponent], roomId };
        }
        catch (error) {
            throw error;
        }
    }
    async sendMove(move, roomId, server, socket, gameId) {
        server.to(roomId).emit('game-move', move);
        console.log('Sending move: ', move);
        const recipientMove = await new Promise((resolve) => {
            socket.once('recipient-response', resolve);
        });
        if (recipientMove === move) {
            console.log('Recipient received a move', recipientMove);
            this.updateDatabaseMoves(move, gameId);
        }
        else {
            throw new Error('Error in sending a move to the recipient, the recipient did not receive the move or it was not correct.');
        }
    }
    async receiveMove(move, socket) {
        if (!move) {
            throw new Error('Move by recipient is undefined');
        }
        socket.emit('recipient-response', move);
        socket.emit('response-opponent-move', move);
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
        const game = await GameModel_1.default.findById(gameId);
        game.moves.push(move);
        await game.save();
    }
}
exports.default = OnlineGameService;
