"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEngineService_1 = __importDefault(require("../services/EngineServices/baseEngineService"));
const TIMEOUT_MS = 10000;
class EngineService extends baseEngineService_1.default {
    engineProcess = null;
    depth = 20;
    constructor(engineProcess, depth) {
        super(engineProcess);
        this.engineProcess = engineProcess;
        this.depth = depth;
    }
    startEngine(callback) {
        if (this.engineProcess) {
            this.engineProcess.on('error', (error) => {
                this.handleEngineError(error, callback);
            });
            this.engineProcess.on('close', (code) => {
                this.handleEngineClose(code, callback);
            });
        }
    }
    stopEngine(callback) {
        if (this.engineProcess) {
            this.engineProcess.kill();
            this.engineProcess = null;
        }
        callback('Engine stopped');
    }
}
exports.default = EngineService;
