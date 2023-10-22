"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseEngineService {
    engineProcess = null;
    constructor(engineProcess) {
        this.engineProcess = engineProcess;
    }
    onEngineData(data, callback, eventFunction) {
        const dataText = data.toString();
        eventFunction(dataText);
        if (dataText.match(/bestmove\s\w{4}\sponder\s\w{4}/)) {
            console.log('Calculated move end');
            callback('Engine calculation complete');
        }
    }
    handleEngineError(error, callback) {
        callback('Error in the engine process: ' + error.message);
    }
    handleEngineClose(code, timeoutId, callback) {
        clearTimeout(timeoutId);
        if (code !== 0) {
            callback(`Engine process closed with code ${code}`);
        }
    }
}
exports.default = BaseEngineService;
