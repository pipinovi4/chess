"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const worker_threads_1 = require("worker_threads");
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const workerPath = path.join(__dirname, '..', 'workers', 'worker.js');
class EngineService {
    constructor() {
        this.engineProcess = null;
        this.engineWorker = null;
    }
    createWorker() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const worker = new worker_threads_1.Worker(workerPath);
                this.engineWorker = worker;
                resolve();
            });
        });
    }
    getEngineWorker() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.engineWorker) {
                    console.log('The worker doesn not exist, create a new worker and start the engine');
                    yield this.createWorker();
                    this.startEngine((status) => console.log(status));
                }
                return this.engineWorker;
            }
            catch (error) {
                console.error(error);
                throw ApiError_1.default.UnforseenError();
            }
        });
    }
    getEngineProcess() {
        if (this.engineProcess) {
            return this.engineProcess;
        }
    }
    startEngine(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (this.engineProcess) {
                    callback('Engine is already running');
                    resolve();
                    return;
                }
                const enginePath = path.join(__dirname, '..', '..', 'engine', 'stockfish.exe');
                this.engineProcess = (0, child_process_1.spawn)(enginePath);
                (_a = this.engineProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                    console.log(`Engine Output: ${data.toString()}`);
                });
                this.engineProcess.on('error', (error) => {
                    console.error(`Engine Error: ${error.message}`);
                    callback(`Error starting engine: ${error.message}`);
                    reject(error);
                });
                this.engineProcess.on('close', (code) => {
                    console.log(`Engine Exited with Code ${code}`);
                    if (code === 0) {
                        callback('Engine started successfully');
                        resolve();
                    }
                    else {
                        callback(`Engine exited with code ${code}`);
                        reject(`Engine exited with code ${code}`);
                    }
                });
            }));
        });
    }
    stopEngine(callback) {
        if (this.engineProcess) {
            this.engineProcess.kill();
            this.engineProcess = null;
        }
        callback('Engine stopped');
    }
}
exports.default = new EngineService();
