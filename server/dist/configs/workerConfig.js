"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const engineService_1 = __importDefault(require("../services/engineService"));
let sharedWorker = null;
const createWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const worker = new worker_threads_1.Worker(__filename);
        worker.on('online', () => {
            resolve(worker);
        });
        if (!sharedWorker) {
            sharedWorker = worker;
        }
        return sharedWorker;
    });
});
const workerConfig = (message, payload = null) => __awaiter(void 0, void 0, void 0, function* () {
    if (worker_threads_1.isMainThread) {
        const worker = yield createWorker();
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
});
exports.default = workerConfig;
//# sourceMappingURL=workerConfig.js.map