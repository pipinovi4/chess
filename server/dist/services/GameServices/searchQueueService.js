"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const SearchQueue_1 = __importDefault(require("../../models/SearchQueue"));
class searchQueueService {
    async searchOpponent(socketId) {
        try {
            if (!socketId) {
                throw ApiError_1.default.BadRequest('socketId is not defined');
            }
            await SearchQueue_1.default.create({
                socketId,
            });
            const opponentSocketId = SearchQueue_1.default.find();
            return opponentSocketId;
        }
        catch (e) {
            console.error(e);
            throw ApiError_1.default.UnforseenError();
        }
    }
}
exports.default = new searchQueueService();
