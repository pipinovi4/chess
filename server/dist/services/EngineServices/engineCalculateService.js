"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chess_js_1 = require("chess.js");
const ApiError_1 = __importDefault(require("../../exceptions/ApiError"));
const EngineModel_1 = __importDefault(require("../../models/customModels/EngineModel"));
class EngineCalculateService extends EngineModel_1.default {
    chess = new chess_js_1.Chess();
    fen = this.chess.fen();
    bestMoves = [];
    pawnAdvantage = 0;
    currentStrokeRate = this.bestMoves.length - 1;
    constructor(engineProcess) {
        super(engineProcess);
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
        console.log(this.fen);
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
                if (listening &&
                    dataText.match(/bestmove\s\w{4}(?:\sponder\s\w{4})?/)) {
                    console.log('resolve');
                    listening = false;
                    this.currentStrokeRate = this.extractDifficaltyBot();
                    this.chess.move(this.bestMoves[this.currentStrokeRate]);
                    console.log('321321313', this.currentStrokeRate, this._bestMoves[this.currentStrokeRate]);
                    resolve(this.currentStrokeRate);
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
                console.log('dsadasndjarea', this.bestMoves);
                reject();
            });
        });
    }
    extractUsefulData(dataText) {
        const moveMatch = dataText.match(/info depth \d+[^]+pv\s+([\w\d]+)/);
        if (moveMatch && moveMatch[1]) {
            this.bestMoves = this.bestMoves.filter((move) => {
                return move !== moveMatch[1];
            });
            this.bestMoves.push(moveMatch[1]);
        }
        if (dataText.includes(`depth ${this.depth}`)) {
            const pawnAdvantageMatch = dataText.match(/score cp (-?\d+)/);
            const mateStepsMatch = dataText.match(/score mate (-?\d+)/);
            if (pawnAdvantageMatch) {
                this.pawnAdvantage = parseInt(pawnAdvantageMatch[1], 10) / 100.0;
            }
            else if (mateStepsMatch) {
                this.pawnAdvantage = parseInt(mateStepsMatch[1], 10).toString();
            }
        }
    }
    extractDifficaltyBot() {
        const randomNumber = Math.random();
        if (this.difficultyBot === 'begginer') {
            if (this.bestMoves.length > 1) {
                return randomNumber > 0.5 ? 0 : 1;
            }
            return 0;
        }
        if (this.difficultyBot === 'amateur') {
            if (this.bestMoves.length > 2) {
                return randomNumber > 0.5 ? 1 : 2;
            }
            else if (this.bestMoves.length > 1) {
                return 1;
            }
            return 1;
        }
        if (this.difficultyBot === 'proffesional') {
            return this.bestMoves.length - 1;
        }
    }
    get _currentStrokeRate() {
        return this.currentStrokeRate;
    }
    get _pawnAdvantage() {
        return this.pawnAdvantage;
    }
    get _bestMoves() {
        return this.bestMoves;
    }
}
exports.default = EngineCalculateService;
