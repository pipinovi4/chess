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
const GameModel_1 = __importDefault(require("../models/GameModel"));
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
class gameController {
    createGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const gameData = yield GameModel_1.default.create({
                    users: [user],
                });
                if (!gameData) {
                    return ApiError_1.default.BadRequest('Undefined session game data', []);
                }
                res.status(200).json(gameData);
            }
            catch (e) {
                return ApiError_1.default.UnforseenError();
            }
        });
    }
}
exports.default = new gameController();
