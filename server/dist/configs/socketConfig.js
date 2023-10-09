"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const chatSocket_1 = __importDefault(require("../sockets/chatSocket"));
const engineSocket_1 = __importDefault(require("../sockets/engineSocket"));
const socketConfig = (httpsServer) => {
    const io = new socket_io_1.Server(httpsServer, {
        cors: {
            origin: 'https://localhost:5173',
        },
    });
    const socketChat = io.of('/chat');
    const socketEngine = io.of('/engine');
    (0, chatSocket_1.default)(socketChat);
    (0, engineSocket_1.default)(socketEngine);
};
exports.default = socketConfig;
