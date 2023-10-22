import { Namespace, Socket } from 'socket.io'
import { Worker } from 'worker_threads'
import setupWorkerMessageListener from '../workers/setupWorkerMessageListener'
import path from 'path'

const workerPath = path.join(__dirname, '..', 'workers', 'worker.js')

/**
 * Initializes a socket for handling the game engine.
 *
 * @param server - The server namespace.
 */
const engineSocket = (server: Namespace) => {
    const onConnection = (socket: Socket) => {
        let engineWorker: Worker | null = null;
        console.log('Socket with id', socket.id, 'connected')
        
        // Socket error handler.
        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })
        
        socket.on('start-engine', async (payload) => {
            engineWorker = new Worker(workerPath)
            setupWorkerMessageListener(socket, engineWorker)

            console.log('Socket message to worker to start engine')
            console.log('Main', payload)

            // Send a message to the worker to start the engine.
            engineWorker.postMessage({
                message: 'start-engine',
                mode: payload.mode,
            })
        })

        socket.on('calculate-move', async (move: string) => {
            console.log('Move', move)

            // Send a message to the worker to calculate a move.
            engineWorker.postMessage({ message: 'calculate-move', move })
        })

        socket.on('stop-engine', async (payload) => {
            console.log('Socket message to worker to stop engine')

            // Send a message to the worker to stop the engine.
            engineWorker.postMessage({ message: 'stop-engine', payload })
        })

        socket.on('disconnect', () => {
            console.log('Engine socket disconnected')
            if (engineWorker) {
                engineWorker.terminate();
            }
        })
    }

    // Handler for a client's connection to the server.
    server.on('connection', onConnection)
}

export default engineSocket
