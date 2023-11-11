"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const onlineGameSocket_1 = __importDefault(require("../sockets/onlineGameSocket"));
const engineSocket_1 = __importDefault(require("../sockets/engineSocket"));
const socketConfig = (httpsServer) => {
    const serverSocket = new socket_io_1.Server(httpsServer, {
        cors: {
            origin: 'https://localhost:5173',
        },
    });
    const onlineGameNameSpace = serverSocket.of('/online-game');
    const engineNameSpace = serverSocket.of('/engine');
    (0, onlineGameSocket_1.default)(onlineGameNameSpace);
    (0, engineSocket_1.default)(engineNameSpace);
};
exports.default = socketConfig;
