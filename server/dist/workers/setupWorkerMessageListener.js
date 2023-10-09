"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setupWorkerMessageListener = (socket, worker) => {
    worker.on('message', (messagePayload) => {
        socket.emit(messagePayload.message, messagePayload);
    });
};
exports.default = setupWorkerMessageListener;
