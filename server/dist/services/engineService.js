"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const enginePath = 'C:/Users/Пипин/Downloads/stockfish-windows-x86-64-modern2/stockfish/stockfish-windows-x86-64-modern.exe';
class EngineService {
    constructor() {
        this.engineProcess = null;
    }
    startEngine(callback) {
        var _a;
        if (!this.engineProcess) {
            this.engineProcess = (0, child_process_1.spawn)(enginePath);
            console.log(this.engineProcess);
            (_a = this.engineProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                console.log(`Engine Output: ${data.toString()}`);
            });
            this.engineProcess.on('error', (error) => {
                console.error(`Engine Error: ${error.message}`);
                callback(`Error starting engine: ${error.message}`);
            });
            this.engineProcess.on('close', (code) => {
                console.log(`Engine Exited with Code ${code}`);
                if (code === 0) {
                    callback('Engine started successfully');
                }
                else {
                    callback(`Engine exited with code ${code}`);
                }
            });
        }
        else {
            callback('Engine is already running');
        }
    }
    sendCommand(command) {
        var _a;
        if (this.engineProcess) {
            (_a = this.engineProcess.stdin) === null || _a === void 0 ? void 0 : _a.write(`${command}\n`);
        }
        else {
            console.error('Engine is not running. Start it first.');
        }
    }
    calculateBestMoves(fen, depth, callback) {
        var _a, _b;
        if (!this.engineProcess) {
            return callback("Engine process is not running.");
        }
        const bestMoves = [];
        (_a = this.engineProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('error', (error) => {
            console.error('Error in engine stdout:', error);
            callback("Error in engine stdout", error.message);
        });
        (_b = this.engineProcess.stdout) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            var _a;
            const output = data.toString();
            const moves = this.extractBestMoves(output);
            for (const move of moves) {
                if (!bestMoves.includes(move)) {
                    bestMoves.push(move);
                }
            }
            if (bestMoves.length >= 3) {
                console.log('Best Moves:', bestMoves);
                (_a = this.engineProcess) === null || _a === void 0 ? void 0 : _a.kill();
                callback("Calculation completed successfully");
            }
        });
        this.engineProcess.on('error', (error) => {
            console.error('Error in engine process:', error);
            callback("Error in engine process", error.message);
        });
        this.engineProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Engine process closed with code ${code}`);
                callback(`Engine process closed with code ${code}`);
            }
        });
    }
    extractBestMoves(output) {
        const moves = [];
        const lines = output.split('\n');
        for (const line of lines) {
            if (line.includes('bestmove')) {
                const match = line.match(/bestmove\s+(\S+)/);
                if (match && match[1] !== null) {
                    const move = match[1];
                    moves.push(move);
                }
            }
        }
        return moves.slice(0, 3);
    }
    calculateMove(move, depth) {
        this.sendCommand(`go depth ${depth} movetime 10000 ${move}`);
    }
    stopEngine(callback) {
        if (this.engineProcess) {
            this.engineProcess.kill();
            this.engineProcess = null;
            console.log(this.engineProcess);
        }
    }
}
exports.default = new EngineService();
//# sourceMappingURL=engineService.js.map