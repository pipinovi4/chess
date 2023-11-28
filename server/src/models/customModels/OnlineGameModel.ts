import { ObjectId, Types } from 'mongoose'
import OnlineGameService from '../../services/OnlineGameService/OnlineGameService'
import { Namespace, Socket } from 'socket.io'
import CustomOnlineGameSocket from '../../sockets/CustomSockets/types/TypesCustomSockets'
import GameModel from '../DB/GameModel'

/**
 * Represents a model for online games, providing methods for game preparation and management.
 */
class OnlineGameModel extends OnlineGameService {
    private onlineGameSocket: Socket | null = null
    private gameId: Types.ObjectId | null = null
    private roomId: string | null = null

    /**
     * Create an instance of the OnlineGameModel class.
     * @param {Socket} onlineGameSocket - The socket associated with the online game.
     */
    constructor(onlineGameSocket: Socket) {
        super()
        this.onlineGameSocket = onlineGameSocket
    }

    /**
     * Prepares and starts an online game for the specified player.
     * @param {Namespace} server - The socket server namespace.
     * @throws {Error} Throws an error if the data for starting the game is invalid.
     */
    async prepareAndStartOnlineGame(
        server: Namespace,
        socket: CustomOnlineGameSocket
    ) {
        try {
            await this.startOnlineGame(server, socket)
            console.log(this.gameId, this.roomId)
        } catch (error) {
            throw error
        }
    }

    /**
     * Prepares and sends a move in the online game.
     * @param {string} move - The move to be sent.
     * @param {Namespace} server - The socket server namespace.
     * @throws {Error} Throws an error if the data for sending the opponent's move is incorrect.
     */
    async processingGameMove(move: string, server: Namespace) {
        console.log(this.gameId)
        try {
            if (this.roomId && this.gameId) {
                let opponentId: string
                const currentGame = await GameModel.findById(this.gameId)
                currentGame.users.forEach((user) => {
                    if (user !== this.onlineGameSocket.id) opponentId = user
                })
                const opponentSocket = server.sockets.get(
                    opponentId
                ) as CustomOnlineGameSocket
                await opponentSocket.getGameMove(move)
                this.updateDatabaseMoves(move, this.gameId)
            } else {
                throw new Error(
                    "Data for sending the opponent's move is incorrect"
                )
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Prepares and stops the online game.
     * @param {Namespace} server - The socket server namespace.
     */
    async prepareAndStopGame(server: Namespace) {
        try {
            if (this.onlineGameSocket && server) {
                await this.stopGame(
                    this.roomId,
                    this.gameId,
                    this.onlineGameSocket,
                    server
                )
            } else {
                console.error('Data for stopping the online game is incorrect')
            }
        } catch (error) {
            throw error
        }
    }

    public setGameId(gameId: Types.ObjectId) {
        this.gameId = gameId
    }

    public setRoomId(roomId: string) {
        this.roomId = roomId
    }

    public getGameId() {
        return this.gameId
    }

    public getRoomId() {
        return this.roomId
    }
}

export default OnlineGameModel
