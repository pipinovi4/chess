"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GameModel = new mongoose_1.Schema({
    moves: [{ type: String }],
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    timeStamp: { type: Date, default: Date.now() },
});
exports.default = (0, mongoose_1.model)('Game', GameModel);
//# sourceMappingURL=GameModel.js.map