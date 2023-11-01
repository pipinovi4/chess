"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEngineService_1 = __importDefault(require("../EngineServices/baseEngineService"));
class BaseOnlineGameService {
    onError(message, error) {
        console.error(message);
        throw error;
    }
}
exports.default = baseEngineService_1.default;
