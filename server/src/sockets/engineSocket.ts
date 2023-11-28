import { Socket } from 'socket.io'
import { Worker } from 'worker_threads'
import setupWorkerMessageListener from '../workers/setupWorkerMessageListener'
import path from 'path'
import { Namespace } from 'socket.io'

const workerPath = path.join(__dirname, '..', 'workers', 'worker.js')
type difficultyBot = 'begginer' | 'amateur' | 'proffesional'
const engineWorker = new Worker(workerPath)

/**
 * Initializes a socket for handling the game engine.
 *
 * @param server - The server namespace.
 */
const engineSocket = (server: Namespace) => {
    const onConnection = (socket: Socket) => {
        console.log('Socket with id', socket.id, 'connected')
        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        socket.on('start-engine', async (difficultyBot: difficultyBot) => {
            console.log('diffucaltyBot', difficultyBot, engineWorker)
            setupWorkerMessageListener(socket, engineWorker);
            console.log('Socket message to worker to start engine', engineWorker)

            // Send a message to the worker to start the engine.
            engineWorker.postMessage({
                message: 'start-engine', difficultyBot
            })
        })

        socket.on('calculate-move', async (move: string) => {
            setupWorkerMessageListener(socket, engineWorker);
            console.log('Move', move)

            // Send a message to the worker to calculate a move.
            engineWorker.postMessage({ message: 'calculate-move', move })
        })

        socket.on('disconnect', () => {
            console.log('Engine process disconnected')
        })
    }
    server.on('connection', onConnection)
}

export default engineSocket
