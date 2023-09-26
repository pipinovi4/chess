"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongooseConfig = () => {
    mongoose_1.default.connect("mongodb://127.0.0.1:27017/chess-up");
    const db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error'));
    db.once('open', () => console.log('Connected to mongodb'));
};
exports.default = mongooseConfig;
//# sourceMappingURL=mongoose-config.js.map