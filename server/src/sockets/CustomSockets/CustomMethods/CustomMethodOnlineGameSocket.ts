import OnlineGameModel from '../../../models/customModels/OnlineGameModel'
import CustomOnlineGameSocket from '../types/TypesCustomSockets'

export function addCustomMethods(
    socket: CustomOnlineGameSocket,
    gameModel: OnlineGameModel
) {
    socket.receiveGameData = async (roomId, gameId) => {
        try {
            if (!roomId || !gameId) {
                console.log('Received game data for opponent is incorrect')
                throw new Error('Received game data is incorrect')
            }

            console.log('Receiving game data to opponent', gameId, roomId)
            socket.join(roomId)
            gameModel.setGameId(gameId)
            gameModel.setRoomId(roomId)
            socket.isMatchMaking = true
        } catch (error) {
            console.error(
                'Error when trying to get game data in the custom socket method:',
                error
            )
            throw new Error(
                'Error when trying to get game data in the custom socket method.'
            )
        }
    }

    socket.getGameMove = async (move: string) => {
        try {
            console.log('Received game move:', move)
            await gameModel.updateDatabaseMoves(move, gameModel.getGameId())
            socket.emit('opponent-game-move', move)
        } catch (error) {
            throw new Error(
                'Error when trying get opponent move method custom socket getGameMove: ',
                error
            )
        }
    }

    socket.isMatchMaking = false
}
