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
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const GameModel_1 = __importDefault(require("../models/GameModel"));
class gameService {
    createGame(usersSocketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!usersSocketId || usersSocketId.length !== 2) {
                    throw ApiError_1.default.BadRequest("Invalid number of users for game creation");
                }
                const game = yield GameModel_1.default.create({
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
        });
    }
    updateMovesGame(move, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!move) {
                    throw ApiError_1.default.BadRequest('Move undefined');
                }
                if (!gameId) {
                    throw ApiError_1.default.BadRequest('GameId undefined');
                }
                const game = yield GameModel_1.default.findById(gameId);
                if (!game) {
                    throw ApiError_1.default.BadRequest('Игра не найдена');
                }
                game.moves.push(move);
                yield game.save();
                return game;
            }
            catch (error) {
                console.error('Произошла ошибка при обновлении ходов игры:', error);
                throw ApiError_1.default.UnforseenError();
            }
        });
    }
    endGame(status, userSocketId, gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!status) {
                throw ApiError_1.default.BadRequest('Status is not defined');
            }
            if (!userSocketId) {
                throw ApiError_1.default.BadRequest('User is not defined');
            }
            const game = yield GameModel_1.default.findById(gameId);
            game.status = status;
            yield game.save();
        });
    }
}
exports.default = new gameService();
