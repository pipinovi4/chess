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
const engineService_1 = __importDefault(require("./engineService"));
const chess_js_1 = require("chess.js");
class engineCalculateServies {
    constructor() {
        this.chess = new chess_js_1.Chess();
        this.fen = this.chess.fen();
    }
    updateFen(move) {
        this.chess.move(move);
        this.fen = this.chess.fen();
        console.log('Updated fen position after move e4', this.fen);
    }
    calculateBestMoves(move) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a, _b, _c, _d;
                this.engineProcess = engineService_1.default.getEngineProcess();
                if (!this.engineProcess) {
                    reject('Engine process is not running.');
                    return;
                }
                const bestMoves = [];
                this.updateFen(move);
                (_a = this.engineProcess.stdin) === null || _a === void 0 ? void 0 : _a.write(`position fen ${this.fen}\n`);
                (_b = this.engineProcess.stdin) === null || _b === void 0 ? void 0 : _b.write('go depth 30\n');
                (_c = this.engineProcess.stdout) === null || _c === void 0 ? void 0 : _c.on('error', (error) => {
                    console.error('Error in engine stdout:', error);
                    reject('Error in engine stdout');
                });
                (_d = this.engineProcess.stdout) === null || _d === void 0 ? void 0 : _d.on('data', (data) => {
                    const output = data.toString();
                    const moves = this.extractBestMoves(output);
                    for (const move of moves) {
                        if (!bestMoves.includes(move)) {
                            bestMoves.push(move);
                        }
                    }
                    if (bestMoves.length >= 3) {
                        console.log('Best Moves:', bestMoves);
                        resolve(bestMoves);
                    }
                });
                this.engineProcess.on('error', (error) => {
                    console.error('Error in engine process:', error);
                    reject('Error in engine process');
                });
                this.engineProcess.on('close', (code) => {
                    if (code !== 0) {
                        console.error(`Engine process closed with code ${code}`);
                        reject(`Engine process closed with code ${code}`);
                    }
                });
            });
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
        return moves.slice(0, 10);
    }
}
exports.default = new engineCalculateServies();
