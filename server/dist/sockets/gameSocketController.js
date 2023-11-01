"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queueModel_1 = __importDefault(require("../models/queueModel"));
const engineSocket_1 = __importDefault(require("./engineSocket"));
const onlineGameSocket_1 = __importDefault(require("./onlineGameSocket"));
const chatSocket_1 = __importDefault(require("./chatSocket"));
const QUEUE = new queueModel_1.default();
const socketController = (server) => {
    const onConnection = (socket) => {
        console.log(`User with id ${socket.id} connected`);
        socket.once('start-game', async (gameMode) => {
            switch (gameMode) {
                case 'online-game':
                    (0, onlineGameSocket_1.default)(socket);
                    break;
                case 'start-bot':
                    (0, engineSocket_1.default)(socket);
                    break;
                default: (0, chatSocket_1.default)(socket);
            }
        });
    };
    server.on('connection', onConnection);
};
exports.default = socketController;
