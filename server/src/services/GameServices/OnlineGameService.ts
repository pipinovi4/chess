import { Namespace, Socket } from 'socket.io'
import QueueModel from '../../models/customModels/QueueModel'
import GameModel from '../../models/DB/GameModel'
import * as uuid from 'uuid'
import ApiError from '../../exceptions/ApiError'
import { ObjectId } from 'mongoose'

/**
 * Service for managing online games and game interactions.
 */
class OnlineGameService {
    queue: QueueModel

    /**
     * Creates an instance of OnlineGameService.
     */
    constructor() {
        this.queue = new QueueModel()
    }

    /**
     * Start an online game for the specified player.
     * @param {string} player - The player's identifier (socket ID).
     * @param {Namespace} server - The socket server namespace.
     * @returns {Promise<{gameId: ObjectId, players: string[], roomId: string} | null>} A promise that resolves to game data if a game is started successfully; otherwise, null.
     */
    protected async startOnlineGame(
        player: string,
        server: Namespace
    ): Promise<{
        gameId: ObjectId
        players: string[]
        roomId: string
    } | null> {
        this.queue.addToQueue(player)

        if (this.queue.usersQueue.length < 2) {
            return null
        }

        const roomId = uuid.v4()
        const players = await this.queue.findMatchingPlayer()

        if (!players) {
            throw new Error(
                'Error when trying to get players found in the queue search'
            )
        }

        for (const player of players) {
            server.to(player).socketsJoin(roomId)
            this.queue.removeFromQueue(player)
        }

        const gameModel = new GameModel({
            status: 'active',
            users: players,
        })

        await gameModel.save()

        if (!gameModel) {
            throw ApiError.BadRequest('Game model was not created')
        }

        return { gameId: gameModel.id, players, roomId }
    }

    /**
     * Send a move to the game room and listen for the recipient's response.
     * @param {string} move - The move to be sent.
     * @param {string} roomId - The identifier of the game room.
     * @param {Namespace} server - The socket server namespace.
     * @param {Socket} socket - The socket for communication.
     * @param {ObjectId} gameId - The identifier of the game.
     * @throws {Error} Throws an error if the recipient did not receive the move or it was not correct.
     */
    protected async sendMove(
        move: string,
        roomId: string,
        server: Namespace,
        socket: Socket,
        gameId: ObjectId
    ) {
        server.to(roomId).emit('game-move', move)

        const recipientMove = await new Promise<string>((resolve) => {
            socket.once('recipient-response', resolve)
        })

        if (recipientMove === move) {
            console.log('Recipient received a move', recipientMove)
            this.updateDatabaseMoves(move, gameId)
        } else {
            throw new Error(
                'Error in sending a move to the recipient, the recipient did not receive the move or it was not correct.'
            )
        }
    }

    /**
     * Receive a move from the opponent and respond with a recipient response.
     * @param {string} move - The move received from the opponent.
     * @param {Socket} socket - The socket for communication.
     * @throws {Error} Throws an error if the move by the recipient is undefined.
     */
    public async receiveMove(move: string, socket: Socket) {
        if (!move) {
            throw new Error('Move by recipient is undefined')
        }

        socket.emit('recipient-response', move)
        socket.emit('response-opponent-move', move)
    }

    /**
     * Stop the game, disconnect sockets, and update the game status.
     * @param {string} roomId - The identifier of the game room.
     * @param {ObjectId} gameId - The identifier of the game.
     * @param {Socket} socket - The socket for communication.
     * @param {Namespace} server - The socket server namespace.
     * @throws {Error} Throws an error if there's a problem stopping the game.
     */
    protected async stopGame(
        roomId: string,
        gameId: ObjectId,
        socket: Socket,
        server: Namespace
    ) {
        server.to(roomId).disconnectSockets(true)
        socket.disconnect(true)

        const game = await GameModel.findById(gameId)

        if (game) {
            game.status = 'finished'
            await game.save()
        } else {
            console.error(
                'Game was not found in database when updating the game status to "finished"'
            )
        }
    }

    /**
     * Update the database with the provided move for the game.
     * @param {string} move - The move to be saved to the database.
     * @param {ObjectId} gameId - The identifier of the game.
     */
    protected async updateDatabaseMoves(move: string, gameId: ObjectId) {
        const game = await GameModel.findById(gameId)
        game.moves.push(move)
        await game.save()
    }
}

export default OnlineGameService
