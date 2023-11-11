"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomMethods = void 0;
function addCustomMethods(socket, gameModel) {
    socket.receiveGameData = async (roomId, gameId) => {
        try {
            console.log(gameModel);
            await new Promise((resolve, reject) => {
                if (roomId && gameId) {
                    console.log('Receiving game data to opponent', gameId, roomId);
                    socket.join(roomId);
                    gameModel.setGameId(gameId);
                    gameModel.setRoomId(roomId);
                    resolve();
                }
                else {
                    console.log('Received game data for opponent is incorrect');
                    reject(new Error('Received game data is incorrect'));
                }
            });
        }
        catch (error) {
            throw new Error('When trying get game data in method custom socket: ', error);
        }
    };
    socket.getGameMove = async (move) => {
        try {
            console.log('Received game move:', move);
            await gameModel.updateDatabaseMoves(move, gameModel.getGameId());
            socket.emit('opponent-game-move');
        }
        catch (error) {
            throw new Error('Error when trying get opponent move method custom socket getGameMove: ', error);
        }
    };
}
exports.addCustomMethods = addCustomMethods;
