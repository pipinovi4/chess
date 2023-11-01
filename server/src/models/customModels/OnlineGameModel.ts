import { ObjectId } from 'mongoose'
import OnlineGameService from '../../services/GameServices/OnlineGameService'
import { Namespace, Socket } from 'socket.io'

/**
 * Represents a model for online games, providing methods for game preparation and management.
 */
class OnlineGameModel extends OnlineGameService {
    private players: Array<string> = []
    private onlineGameSocket: Socket | null = null
    private gameId: ObjectId | null = null
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
     * @param {string} player - The player's identifier.
     * @param {Namespace} server - The socket server namespace.
     * @throws {Error} Throws an error if the data for starting the game is invalid.
     */
    async prepareAndStartOnlineGame(player: string, server: Namespace) {
        try {
            const { gameId, players, roomId } = await this.startOnlineGame(
                player,
                server
            )
            if (gameId && player && players.length === 2) {
                this.gameId = gameId
                this.players = players
                this.roomId = roomId
            } else {
                throw new Error(
                    'Invalid data received when trying to start an online game'
                )
            }
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
    async prepareAndSendMove(move: string, server: Namespace) {
        try {
            if (
                move &&
                this.roomId &&
                this.gameId &&
                server &&
                this.onlineGameSocket
            ) {
                await this.sendMove(
                    move,
                    this.roomId,
                    server,
                    this.onlineGameSocket,
                    this.gameId
                )
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

    /**
     * Get the list of players in the game.
     * @returns {Array<string>} An array of player identifiers.
     */
    getPlayers(): Array<string> {
        return this.players
    }
}

export default OnlineGameModel
