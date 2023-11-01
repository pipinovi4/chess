import { Socket, io } from 'socket.io-client'
import { ResponseServer } from '../types'

// Constants
const TIMEOUT_MS = 20000

/**
 * Service for interacting with the game engine through a socket.
 */
class EngineSocketService {
    /**
     * Start a connection with the game engine socket.
     * @returns {Promise<Socket>} A promise that resolves with the socket connection.
     */
    async startEngine(): Promise<Socket> {
        return new Promise((resolve) => {
            const engineSocket: Socket = io('https://localhost:5000/engine')
            engineSocket.emit('start-engine')

            engineSocket.once('engine-started', () => {
                console.log('Game started')
                resolve(engineSocket)
            })
        })
    }

    /**
     * Send a move to the game engine and await a response.
     * @param {string} move - The move to send to the engine.
     * @param {Socket<DefaultEventsMap, DefaultEventsMap>} engineSocket - The game engine socket.
     * @returns {Promise<ResponseServer | void>} A promise that resolves with the response from the engine or null in case of an error.
     */
    async sendMoveEngine(
        move: string,
        engineSocket: Socket
    ): Promise<ResponseServer | void> {
        return new Promise((resolve, reject) => {
            engineSocket.emit('calculate-move', move)
            console.log(313213123)

            engineSocket.once(
                'move-calculated',
                (engineData: ResponseServer) => {
                    console.log('Data from engine', engineData)
                    resolve(engineData)
                }
            )

            setTimeout(() => {
                reject('')
            }, TIMEOUT_MS)
        })
    }

    /**
     * Stop the game engine and disconnect from the socket.
     * @param {Socket<DefaultEventsMap, DefaultEventsMap>} engineSocket - The game engine socket.
     * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the game engine is stopped successfully.
     */
    async stopEngine(engineSocket: Socket): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (engineSocket) {
                engineSocket.emit('end-game')
                engineSocket.once('game-ended', () => {
                    console.log('Game has ended')
                    engineSocket.disconnect()
                    resolve(true)
                })
            } else {
                console.error('Socket is unknown when trying to stop the game')
                reject('Stop engine error')
            }
        })
    }
}

export default EngineSocketService
