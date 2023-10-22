"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const engineCalculateService_1 = __importDefault(require("../services/EngineServices/engineCalculateService"));
const engineService_1 = __importDefault(require("../services/EngineServices/engineService"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const DEPTH = 20;
const enginePath = path_1.default.join(__dirname, '..', '..', 'engine', 'stockfish.exe');
if (!worker_threads_1.isMainThread) {
    let engineService;
    let engineProcess;
    let engineCalculateService;
    worker_threads_1.parentPort.on('message', async (payload) => {
        console.log(payload);
        switch (payload.message) {
            case 'start-engine':
                engineProcess = (0, child_process_1.spawn)(enginePath);
                engineService = new engineService_1.default(engineProcess, DEPTH);
                engineCalculateService = new engineCalculateService_1.default(engineProcess, DEPTH);
                console.log('Starting the engine...');
                engineService.startEngine((status) => {
                    console.log(chalk_1.default.bgWhite(), 'Status:', status);
                });
                worker_threads_1.parentPort.postMessage({ message: 'ENGINE_STARTED' });
                break;
            case 'calculate-move':
                console.log('Calculating the best move...');
                await engineCalculateService.calculateBestMovesAndScore(payload.move);
                worker_threads_1.parentPort.postMessage({
                    message: 'MOVE_CALCULATED',
                    bestMoves: engineCalculateService.bestMoves,
                    pawnAdvantage: engineCalculateService.pawnAdvantage,
                });
                break;
            case 'stop-engine':
                console.log(chalk_1.default.bgGreen(), 'Stopping the engine...');
                engineService.stopEngine((status) => {
                    console.log(chalk_1.default.bgWhite, 'Status:', status);
                });
                break;
        }
    });
}
