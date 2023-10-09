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
const SearchQueue_1 = __importDefault(require("../models/SearchQueue"));
class searchQueueService {
    searchOpponent(socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!socketId) {
                    throw ApiError_1.default.BadRequest('socketId is not defined');
                }
                yield SearchQueue_1.default.create({
                    socketId
                });
                const opponentSocketId = SearchQueue_1.default.find();
                return opponentSocketId;
            }
            catch (e) {
                console.error(e);
                throw ApiError_1.default.UnforseenError();
            }
        });
    }
}
exports.default = new searchQueueService();
