"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatSocket_1 = __importDefault(require("../sockets/chatSocket"));
const socketConfig = (io) => {
    (0, chatSocket_1.default)(io);
    console.log('last');
};
exports.default = socketConfig;
//# sourceMappingURL=socketConfig.js.map