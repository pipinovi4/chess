"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const engineService_1 = __importDefault(require("../services/engineService"));
const workerConfig = (message, payload = null) => {
    if (worker_threads_1.isMainThread) {
        const worker = new worker_threads_1.Worker(__filename);
        if (payload) {
            worker.postMessage({ message, payload });
        }
        engineService_1.default.startEngine((status) => {
            console.log(status);
        });
        return worker;
    }
    else {
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (message) => {
            const { message: workerMessage, payload } = message;
            switch (workerMessage) {
                case 'start-engine':
                    engineService_1.default.startEngine((status) => {
                        console.log(status);
                    });
                    break;
                case 'calculate-move':
                    if (payload && payload.move && payload.depth) {
                        engineService_1.default.calculateBestMoves(payload.move, payload.depth, (status, error) => {
                            if (error) {
                                console.error('Error in calculate-move:', error);
                            }
                            else {
                                console.log('Calculation completed successfully:', status);
                            }
                        });
                    }
                    else {
                        console.error('Invalid payload for calculate-move');
                    }
                    break;
                case 'stop-engine':
                    engineService_1.default.stopEngine((status) => {
                        console.log(status);
                    });
                    break;
                default:
                    console.error(`Unknown message from main thread: ${workerMessage}`);
                    break;
            }
        });
        return null;
    }
};
exports.default = workerConfig;
//# sourceMappingURL=workerConfig.js.map