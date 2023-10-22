"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chess_js_1 = require("chess.js");
const engineService_1 = __importDefault(require("./engineService"));
const DEPTH = 20;
const TIMEOUT_MS = 10000;
class EngineCalculateService extends engineService_1.default {
    chess = new chess_js_1.Chess();
    fen = this.chess.fen();
    bestMoves = [];
    pawnAdvantage = 0;
    constructor(engineProcess, depth) {
        super(engineProcess, depth);
        const timeoutId = setTimeout(() => {
            console.log('Engine work timeout');
        }, TIMEOUT_MS);
        this.engineProcess.stdout?.on('data', (data) => {
            this.onEngineData(data, (status) => {
                console.log('Status:', status);
            }, timeoutId, this.extractUsefulData);
        });
    }
    updateFen(move) {
        this.chess.move(move);
        this.fen = this.chess.fen();
    }
    async calculateBestMovesAndScore(move) {
        return new Promise(async (resolve, reject) => {
            if (this.bestMoves.length !== 0) {
                this.bestMoves = [];
            }
            if (!this.engineProcess) {
                reject('Engine process is not running.');
            }
            this.updateFen(move);
            this.engineProcess.stdin?.write(`position fen ${this.fen}\n`);
            this.engineProcess.stdin?.write(`go depth ${DEPTH}\n`);
        });
    }
    extractUsefulData(dataText) {
        const moveMatch = dataText.match(/info[^]+pv\s+([\w\d]+)/);
        if (moveMatch && moveMatch[1]) {
            this.bestMoves = this.bestMoves.filter((move) => {
                return move !== moveMatch[1];
            });
            this.bestMoves.push(moveMatch[1]);
        }
        if (dataText.includes(`depth ${DEPTH}`)) {
            const pawnAdvantageMatch = dataText.match(/score cp (-?\d+)/);
            if (pawnAdvantageMatch) {
                this.pawnAdvantage = parseInt(pawnAdvantageMatch[1], 10) / 100.0;
            }
        }
    }
}
exports.default = EngineCalculateService;
