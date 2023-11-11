"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GameModel = new mongoose_1.Schema({
    moves: [{ type: String }],
    users: [{ type: String }],
    timeStamp: { type: Date, default: Date.now() },
    status: { type: String },
});
exports.default = (0, mongoose_1.model)('Game', GameModel);
