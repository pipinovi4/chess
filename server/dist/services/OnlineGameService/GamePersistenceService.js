"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const GameModel_1 = __importDefault(require("../../models/DB/GameModel"));
class GamePeristenceService {
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
}
exports.default = GamePeristenceService;
