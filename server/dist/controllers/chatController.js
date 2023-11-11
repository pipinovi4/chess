"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class chatController {
    async createChat(req, res, next) {
        try {
            const { users } = req.body;
            if (users.length < 2) {
                next();
            }
        }
        catch (e) {
            next(e);
        }
    }
}
exports.default = new chatController();
