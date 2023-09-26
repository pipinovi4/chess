"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workerConfig_1 = __importDefault(require("../configs/workerConfig"));
const engineSocket = (server) => {
    server.on('connect', (socket) => {
        console.log(32131);
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        socket.on('start-engine', (payload) => {
            try {
                (0, workerConfig_1.default)('start-engine', payload);
            }
            catch (error) {
                console.error('Error starting engine:', error);
            }
        });
        socket.on('started-engine', () => {
            try {
                socket.emit('started-engine');
            }
            catch (error) {
                console.error('Error emitting "started-engine" event:', error);
            }
        });
        socket.on('calculate-move', (payload) => {
            try {
                (0, workerConfig_1.default)('calculate-move', payload);
            }
            catch (error) {
                console.error('Error triggering calculate move:', error);
            }
        });
        socket.on('stop-engine', (payload) => {
            try {
                (0, workerConfig_1.default)('stop-engine', payload);
            }
            catch (error) {
                console.error('Error engine has not stopped:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log('Engine socket disconnected');
        });
    });
};
exports.default = engineSocket;
//# sourceMappingURL=engineSocket.js.map