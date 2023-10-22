"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseEngineService {
    engineProcess = null;
    constructor(engineProcess) {
        this.engineProcess = engineProcess;
    }
    onEngineData(data, callback, timeoutId, eventFunction) {
        const dataText = data.toString();
        console.log('Data from engine: ', dataText);
        eventFunction(dataText);
        if (dataText.match(/bestmove\s\w{4}\sponder\s\w{4}/)) {
            console.log('calculated move end');
            clearTimeout(timeoutId);
            callback('Engine calculation complete');
        }
    }
    handleEngineError(error, timeoutId, callback) {
        clearTimeout(timeoutId);
        callback('Error in engine process: ' + error.message);
    }
    handleEngineClose(code, timeoutId, callback) {
        clearTimeout(timeoutId);
        if (code !== 0) {
            callback(`Engine process closed with code ${code}`);
        }
    }
}
exports.default = BaseEngineService;
