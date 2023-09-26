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
const workerConfig_1 = __importDefault(require("../configs/workerConfig"));
class EngineController {
    startEngine(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const worker = (0, workerConfig_1.default)('start-engine');
                worker === null || worker === void 0 ? void 0 : worker.on('message', (message) => {
                    console.log('Received message from worker:', message);
                    res.status(200).json({ message: 'Engine started successfully' });
                });
                worker === null || worker === void 0 ? void 0 : worker.on('error', (error) => {
                    console.error('Error in worker:', error);
                    return next(error);
                });
            }
            catch (e) {
                console.error('Failed to start the engine', e);
                return next(e);
            }
        });
    }
    stopEngine(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const worker = (0, workerConfig_1.default)('stop-engine');
                if (worker) {
                    worker.on('message', (message) => {
                        console.log(message);
                        res.status(200).json({
                            message: 'Engine stopped successfully',
                        });
                    });
                    worker.on('error', (error) => {
                        console.error('Worker error:', error);
                        res.status(500).json({
                            message: 'Error stopping the engine',
                        });
                    });
                }
            }
            catch (e) {
                console.error('Error when stopping the engine', e);
                next(e);
            }
        });
    }
}
exports.default = new EngineController();
//# sourceMappingURL=engineController.js.map