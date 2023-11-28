import { Socket, io } from 'socket.io-client'
import { ResponseServerMove } from '../types'

/**
 * Service for interacting with the game engine through a socket.
 */
class EngineSocketService {
    public engineSocket: Socket | null = null
    /**
     * Start a connection with the game engine socket.
     * @returns {Promise<Socket>} A promise that resolves with the socket connection.
     */
    async startEngine(
        difficultyBot: 'begginer' | 'amateur' | 'proffesional'
    ): Promise<void> {
        return new Promise<void>((resolve) => {
            const engineSocket = io('https://localhost:5000/engine')
            this.engineSocket = engineSocket
            this.engineSocket.emit('start-engine', difficultyBot)

            this.engineSocket.once('engine-started', () => {
                console.log('Game started')
                resolve()
            })

            this.engineSocket.once('disconnect', () =>
                console.log('Socket has been closed')
            )
            this.engineSocket.once('close', () =>
                console.log('Socket has been closed')
            )
        })
    }

    /**
     * Send a move to the game engine and await a response.
     * @param {string} move - The move to send to the engine.
     * @returns {Promise<ResponseServer | void>} A promise that resolves with the response from the engine or null in case of an error.
     */
    async sendMoveEngine(move: string): Promise<ResponseServerMove | void> {
        return new Promise((resolve) => {
            this.engineSocket?.emit('calculate-move', move)

            this.engineSocket?.once(
                'move-calculated',
                (engineData: ResponseServerMove) => {
                    console.log(
                        'Data from engine',
                        engineData,
                        this.engineSocket
                    )
                    resolve(engineData)
                }
            )
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
