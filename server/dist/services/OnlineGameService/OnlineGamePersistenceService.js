"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const GameModel_1 = __importDefault(require("../../models/DB/GameModel"));
class OnlineGamePeristenceService {
    async findAndConnectUsers(sender, server, queueModel) {
        try {
            console.log('3213123');
        }
        catch (error) {
            throw ApiError_1.default.BadRequest('Error when attempting to connect players', error);
        }
    }
    async updateDatabaseMoves(move, gameId) {
        try {
            const game = await GameModel_1.default.findById(gameId);
            if (!game) {
                throw ApiError_1.default.BadRequest('When trying to update a move in the database, the game appeared undefined');
            }
            game.moves.push(move);
            await game.save();
        }
        catch (error) {
            throw ApiError_1.default.UnforeseenError('When trying update moves in database', error);
        }
    }
    async validateMove(move) {
        if (move.match(/^[a-h][1-8][a-h][1-8]$/)) {
            return true;
        }
        return false;
    }
}
exports.default = new OnlineGamePeristenceService();
