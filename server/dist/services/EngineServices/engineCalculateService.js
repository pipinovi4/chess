"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chess_js_1 = require("chess.js");
const engineService_1 = __importDefault(require("./engineService"));
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
class EngineCalculateService extends engineService_1.default {
    chess = new chess_js_1.Chess();
    fen = this.chess.fen();
    bestMoves = [];
    pawnAdvantage = 0;
    constructor(engineProcess, depth) {
        super(engineProcess, depth);
        this.engineProcess.stdout?.on('data', (data) => {
            const dataText = data.toString();
            this.onEngineData(data, (status) => {
                console.log('Status:', status);
            }, () => this.extractUsefulData(dataText));
        });
    }
    updateFen(move) {
        this.chess.move(move);
        this.fen = this.chess.fen();
    }
    async calculateBestMovesAndScore(move) {
        return new Promise((resolve, reject) => {
            if (this.bestMoves.length !== 0) {
                this.bestMoves = [];
            }
            if (!this.engineProcess) {
                throw ApiError_1.default.BadRequest('Engine process undefined');
            }
            let listening = true;
            const onEngineData = (dataText) => {
                if (listening && dataText.match(/bestmove\s\w*\sponder\s\w*/)) {
                    console.log('resolve');
                    listening = false;
                    resolve();
                }
            };
            const onData = (data) => {
                const dataText = data.toString();
                onEngineData(dataText);
            };
            this.updateFen(move);
            this.engineProcess.stdin?.write(`position fen ${this.fen}\n`);
            this.engineProcess.stdin?.write(`go depth ${this.depth}\n`);
            this.engineProcess.stdout?.on('data', onData);
            this.engineProcess.stdout?.once('error', (error) => {
                this.handleEngineError(error, (status) => {
                    console.log('Status:', status);
                });
                listening = false;
                reject();
            });
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
        if (dataText.includes(`depth ${this.depth}`)) {
            const pawnAdvantageMatch = dataText.match(/score cp (-?\d+)/);
            if (pawnAdvantageMatch) {
                this.pawnAdvantage = parseInt(pawnAdvantageMatch[1], 10) / 100.0;
            }
        }
    }
}
exports.default = EngineCalculateService;
