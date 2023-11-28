"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OnlineGameService_1 = __importDefault(require("../../services/OnlineGameService/OnlineGameService"));
const GameModel_1 = __importDefault(require("../DB/GameModel"));
class OnlineGameModel extends OnlineGameService_1.default {
    onlineGameSocket = null;
    gameId = null;
    roomId = null;
    constructor(onlineGameSocket) {
        super();
        this.onlineGameSocket = onlineGameSocket;
    }
    async prepareAndStartOnlineGame(server, socket) {
        try {
            await this.startOnlineGame(server, socket);
            console.log(this.gameId, this.roomId);
        }
        catch (error) {
            throw error;
        }
    }
    async processingGameMove(move, server) {
        console.log(this.gameId);
        try {
            if (this.roomId && this.gameId) {
                let opponentId;
                const currentGame = await GameModel_1.default.findById(this.gameId);
                currentGame.users.forEach((user) => {
                    if (user !== this.onlineGameSocket.id)
                        opponentId = user;
                });
                const opponentSocket = server.sockets.get(opponentId);
                await opponentSocket.getGameMove(move);
                this.updateDatabaseMoves(move, this.gameId);
            }
            else {
                throw new Error("Data for sending the opponent's move is incorrect");
            }
        }
        catch (error) {
            throw error;
        }
    }
    async prepareAndStopGame(server) {
        try {
            if (this.onlineGameSocket && server) {
                await this.stopGame(this.roomId, this.gameId, this.onlineGameSocket, server);
            }
            else {
                console.error('Data for stopping the online game is incorrect');
            }
        }
        catch (error) {
            throw error;
        }
    }
    setGameId(gameId) {
        this.gameId = gameId;
    }
    setRoomId(roomId) {
        this.roomId = roomId;
    }
    getGameId() {
        return this.gameId;
    }
    getRoomId() {
        return this.roomId;
    }
}
exports.default = OnlineGameModel;
