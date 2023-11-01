"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const setupWorkerMessageListener_1 = __importDefault(require("../workers/setupWorkerMessageListener"));
const path_1 = __importDefault(require("path"));
const workerPath = path_1.default.join(__dirname, '..', 'workers', 'worker.js');
const engineSocket = (server) => {
    const onConnection = (socket) => {
        const engineWorker = new worker_threads_1.Worker(workerPath);
        console.log('Socket with id', socket.id, 'connected');
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        socket.on('start-engine', async () => {
            (0, setupWorkerMessageListener_1.default)(socket, engineWorker);
            console.log('Socket message to worker to start engine', engineWorker);
            engineWorker.postMessage({
                message: 'start-engine',
            });
        });
        socket.on('calculate-move', async (move) => {
            (0, setupWorkerMessageListener_1.default)(socket, engineWorker);
            console.log('Move', move);
            engineWorker.postMessage({ message: 'calculate-move', move });
        });
        socket.on('stop-engine', async (payload) => {
            (0, setupWorkerMessageListener_1.default)(socket, engineWorker);
            console.log('Socket message to worker to stop engine');
            engineWorker.postMessage({ message: 'stop-engine', payload });
        });
        socket.on('disconnect', () => {
            console.log('Engine socket disconnected');
            if (engineWorker) {
                engineWorker.terminate();
            }
        });
    };
    server.on('connection', onConnection);
};
exports.default = engineSocket;
