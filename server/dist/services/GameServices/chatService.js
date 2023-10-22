"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const ChatModel_1 = __importDefault(require("../../models/ChatModel"));
class chatService {
    async createChat(users) {
        const chatData = await ChatModel_1.default.create({
            users,
        });
        if (!chatData) {
            throw ApiError_1.default.UnforseenError();
        }
        return chatData;
    }
}
exports.default = new chatService();
