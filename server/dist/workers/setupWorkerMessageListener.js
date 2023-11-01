"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const setupWorkerMessageListener = (socket, worker) => {
    if (!worker) {
        console.error(chalk_1.default.bgRed('Worker is undefined'));
        return;
    }
    worker.once('message', (payload) => {
        const payloadWithoutMessage = { ...payload };
        delete payloadWithoutMessage.message;
        switch (payload.message) {
            case 'ENGINE_STARTED':
                console.log(chalk_1.default.bgGreen('listener', JSON.stringify(payloadWithoutMessage, null, 2)));
                socket.emit('engine-started', payloadWithoutMessage);
                break;
            case 'ENGINE_STOPPED':
                console.log(chalk_1.default.bgGreen('listener', JSON.stringify(payloadWithoutMessage, null, 2)));
                socket.emit('engine-stopped', payloadWithoutMessage);
                break;
            case 'MOVE_CALCULATED':
                console.log(chalk_1.default.bgGreen('listener', JSON.stringify(payloadWithoutMessage, null, 2)));
                socket.emit('move-calculated', payloadWithoutMessage);
                break;
        }
    });
};
exports.default = setupWorkerMessageListener;
