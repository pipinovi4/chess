"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OnlineGameModel_1 = __importDefault(require("../models/customModels/OnlineGameModel"));
const CustomMethodOnlineGameSocket_1 = require("./CustomSockets/CustomMethods/CustomMethodOnlineGameSocket");
const onlineGameSocket = (server) => {
    const onConnection = (socket) => {
        let onlineGame = null;
        socket.on('start-online-game', async () => {
            try {
                onlineGame = new OnlineGameModel_1.default(socket);
                (0, CustomMethodOnlineGameSocket_1.addCustomMethods)(socket, onlineGame);
                await onlineGame.prepareAndStartOnlineGame(server, socket);
            }
            catch (error) {
                console.error('Error while starting an online game:', error.message);
                throw error;
            }
        });
        socket.on('send-move-opponent', async (move) => {
            try {
                await onlineGame.processingGameMove(move, server);
            }
            catch (error) {
                throw new Error('Error when trying send move to opponent: ', error);
            }
        });
        socket.on('stop-online-game', async () => {
            try {
                await onlineGame?.prepareAndStopGame(server);
            }
            catch (error) {
                console.error('Error while stopping the online game:', error.message);
            }
        });
        socket.on('close', async () => {
            console.log('Socket connection lost for socket id: ', socket.id);
            if (onlineGame) {
                try {
                    await onlineGame.prepareAndStopGame(server);
                }
                catch (error) {
                    console.error('Error while stopping the online game:', error.message);
                }
            }
        });
    };
    server.on('connection', onConnection);
};
exports.default = onlineGameSocket;
