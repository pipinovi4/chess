"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const GameModel_1 = __importDefault(require("../models/GameModel"));
class gameService {
    async createGame(usersSocketId) {
        try {
            if (!usersSocketId || usersSocketId.length !== 2) {
                throw ApiError_1.default.BadRequest("Invalid number of users for game creation");
            }
            const game = await GameModel_1.default.create({
                usersSocketId
            });
            if (!game) {
                throw ApiError_1.default.UnforseenError();
            }
            return game._id;
        }
        catch (e) {
            console.error(`Error in gameService.createGame: ${e.message}`);
            throw ApiError_1.default.UnforseenError();
        }
    }
    async updateMovesGame(move, gameId) {
        try {
            if (!move) {
                throw ApiError_1.default.BadRequest('Move undefined');
            }
            if (!gameId) {
                throw ApiError_1.default.BadRequest('GameId undefined');
            }
            const game = await GameModel_1.default.findById(gameId);
            if (!game) {
                throw ApiError_1.default.BadRequest('Игра не найдена');
            }
            game.moves.push(move);
            await game.save();
            return game;
        }
        catch (error) {
            console.error('Произошла ошибка при обновлении ходов игры:', error);
            throw ApiError_1.default.UnforseenError();
        }
    }
    async endGame(status, userSocketId, gameId) {
        if (!status) {
            throw ApiError_1.default.BadRequest('Status is not defined');
        }
        if (!userSocketId) {
            throw ApiError_1.default.BadRequest('User is not defined');
        }
        const game = await GameModel_1.default.findById(gameId);
        game.status = status;
        await game.save();
    }
}
exports.default = new gameService();
