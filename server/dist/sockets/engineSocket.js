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
const setupWorkerMessageListener_1 = __importDefault(require("../workers/setupWorkerMessageListener"));
const engineService_1 = __importDefault(require("../services/engineService"));
const engineSocket = (server) => {
    const onConnection = (socket) => {
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        socket.on('start-engine', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            const worker = yield engineService_1.default.getEngineWorker();
            console.log('Socket message to worker to start engine');
            worker.postMessage(payload);
            (0, setupWorkerMessageListener_1.default)(socket, worker);
        }));
        socket.on('calculate-move', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            const worker = yield engineService_1.default.getEngineWorker();
            console.log('Socket message to worker to calculate move');
            console.log(payload);
            worker.postMessage(payload);
            (0, setupWorkerMessageListener_1.default)(socket, worker);
        }));
        socket.on('stop-engine', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            const worker = yield engineService_1.default.getEngineWorker();
            console.log('Socket message to worker to stop engine');
            worker.postMessage(payload);
            (0, setupWorkerMessageListener_1.default)(socket, worker);
        }));
        socket.on('disconnect', () => {
            console.log('Engine socket disconnected');
        });
    };
    server.on('connection', onConnection);
};
exports.default = engineSocket;
