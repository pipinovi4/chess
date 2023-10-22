"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const searchQueueService_1 = __importDefault(require("../services/GameServices/searchQueueService"));
const searchQueue = (server) => {
    const onConnection = (socket) => {
        socket.on('search-opponent', async () => {
            searchQueueService_1.default.searchOpponent(socket.id);
        });
    };
    server.on('connection', onConnection);
};
exports.default = searchQueue;
