"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatService_1 = __importDefault(require("../services/GameServices/chatService"));
class chatController {
    async createChat(req, res, next) {
        try {
            const { users } = req.body;
            if (users.length < 2) {
                next();
            }
            const chatData = await chatService_1.default.createChat(users);
            return res.status(200).json(chatData);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.default = new chatController();
