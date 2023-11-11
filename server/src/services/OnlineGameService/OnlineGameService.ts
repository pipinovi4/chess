import { Namespace, Socket } from 'socket.io'
import QueueModel from '../../models/customModels/QueueModel'
import GameModel from '../../models/DB/GameModel'
import { ObjectId, Types } from 'mongoose'
import ApiError from '../../exceptions/ApiError'
import * as uuid from 'uuid'
import CustomOnlineGameSocket from '../../sockets/CustomSockets/types/TypesCustomSockets'
import { addCustomMethods } from '../../sockets/CustomSockets/CustomMethods/CustomMethodOnlineGameSocket'

const QUEUE_MODEL = new QueueModel()
// const TIMEOUT = 30 * 100 * 60

class OnlineGameService {
    protected async startOnlineGame(
        server: Namespace,
        socket: CustomOnlineGameSocket
    ): Promise<{ roomId: string; gameId: Types.ObjectId } | undefined | void> {
        try {
            const opponent = await QUEUE_MODEL.findMatchingPlayer(socket)
            if (opponent) {
                const newGame = await GameModel.create({
                    users: [socket.id, opponent],
                    status: 'active'
                })
                if (newGame) {
                    const roomId = uuid.v4()
                    const gameId = newGame._id
                    const opponentSocket = server.sockets.get(opponent) as CustomOnlineGameSocket;

                    if (opponentSocket) {
                      await opponentSocket.receiveGameData(roomId, gameId);
                      server.to(roomId).emit('online-game-started', [opponent, socket.id])
                    } else {
                        throw new Error('Opponent socket not found');
                    }
                    await new Promise((resolve) => {
                        socket.on('match-making-success', (roomId, gameId) => {
                            socket.join(roomId)
                            resolve({roomId, gameId})
                        })
                    })
                } else {
                    throw ApiError.BadRequest(
                        'Connection lost during player connection and game creation'
                    )
                }
            } else {
                QUEUE_MODEL.addToQueue(socket.id)
            }
        } catch (error) {
            throw ApiError.BadRequest(
                'Error when attempting to connect players',
                error
            )
        }
    }

    protected async stopGame(
        roomId: string,
        gameId: Types.ObjectId,
        socket: Socket,
        server: Namespace
    ) {
        server.to(roomId).disconnectSockets(true)
        socket.disconnect(true)

        const game = await GameModel.findById(gameId)

        if (game) {
            game.status = 'finished'
            await game.save()
            socket.emit('online-game-stopped')
        } else {
            console.error(
                'Game was not found in database when updating the game status to "finished"'
            )
        }
    }

    public async updateDatabaseMoves(move: string, gameId: Types.ObjectId) {
        try {
            const game = await GameModel.findById(gameId)
            if (!game) {
                throw ApiError.BadRequest(
                    'When trying to update a move in the database, the game appeared undefined'
                )
            }
            game.moves.push(move)
            console.log(game.moves)
            await game.save()
        } catch (error) {
            throw ApiError.UnforeseenError(
                'When trying to update moves in the database',
                error
            )
        }
    }
}

export default OnlineGameService
