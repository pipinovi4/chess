"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEngineService_1 = __importDefault(require("../../services/EngineServices/baseEngineService"));
const TIMEOUT_MS = 10000;
class EngineModel extends baseEngineService_1.default {
    engineProcess = null;
    depth = 20;
    difficultyBot = 'proffesional';
    constructor(engineProcess) {
        super(engineProcess);
        this.engineProcess = engineProcess;
    }
    startEngine(callback, difficultyBot) {
        if (this.engineProcess) {
            console.log(this.engineProcess);
            this.difficultyBot = difficultyBot;
            this.engineProcess.on('error', (error) => {
                this.handleEngineError(error, callback);
            });
            this.engineProcess.on('close', (code) => {
                this.handleEngineClose(code, callback);
            });
        }
    }
}
exports.default = EngineModel;
