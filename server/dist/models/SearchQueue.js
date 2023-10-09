"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SearchQueueSchema = new mongoose_1.Schema({
    socketId: { type: String, required: true },
    eloPoints: { type: Number, required: true },
});
exports.default = (0, mongoose_1.model)('SearchQueue', SearchQueueSchema);
