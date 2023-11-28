"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const setupWorkerMessageListener_1 = __importDefault(require("../workers/setupWorkerMessageListener"));
const path_1 = __importDefault(require("path"));
const workerPath = path_1.default.join(__dirname, '..', 'workers', 'worker.js');
const engineWorker = new worker_threads_1.Worker(workerPath);
const engineSocket = (server) => {
    const onConnection = (socket) => {
        console.log('Socket with id', socket.id, 'connected');
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        socket.on('start-engine', async (difficultyBot) => {
            console.log('diffucaltyBot', difficultyBot, engineWorker);
            (0, setupWorkerMessageListener_1.default)(socket, engineWorker);
            console.log('Socket message to worker to start engine', engineWorker);
            engineWorker.postMessage({
                message: 'start-engine', difficultyBot
            });
        });
        socket.on('calculate-move', async (move) => {
            (0, setupWorkerMessageListener_1.default)(socket, engineWorker);
            console.log('Move', move);
            engineWorker.postMessage({ message: 'calculate-move', move });
        });
        socket.on('disconnect', () => {
            console.log('Engine process disconnected');
        });
    };
    server.on('connection', onConnection);
};
exports.default = engineSocket;
