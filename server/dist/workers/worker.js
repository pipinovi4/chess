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
const { isMainThread, parentPort } = require('worker_threads');
const engineService = require('../services/engineService.js');
const engineCalculateService = require('../services/engineCalculateService.js');
if (!isMainThread && parentPort) {
    parentPort.on('message', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        switch (payload.message) {
            case 'start-engine':
                yield engineService.default.startEngine((status) => {
                    console.log('Status:', status);
                });
                parentPort.postMessage({ message: payload.message });
                break;
            case 'stop-engine':
                engineService.default.stopEngine((status) => {
                    console.log('Status:', status);
                });
                parentPort.postMessage({ message: payload.message });
                break;
            case 'calculate-move':
                console.log('start');
                const bestsMove = yield engineCalculateService.default.calculateBestMoves(payload.move, (status) => {
                    console.log('Status:', status);
                });
                console.log('result calculateBestMove', bestsMove);
                parentPort.postMessage({ message: payload.message, result: bestsMove });
                break;
        }
    }));
}
