import { Namespace, Socket } from 'socket.io'
import { parentPort, Worker } from 'worker_threads'
import setupWorkerMessageListener from '../workers/setupWorkerMessageListener'
import engineService from '../services/engineService'

const engineSocket = (server: Namespace) => {
    const onConnection = (socket: Socket) => {

        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        socket.on('start-engine', async (payload) => {
            const worker = await engineService.getEngineWorker()

            console.log('Socket message to worker to start engine')
            worker.postMessage(payload)
            setupWorkerMessageListener(socket, worker)
          });
          

        socket.on('calculate-move', async (payload) => {
            const worker = await engineService.getEngineWorker()

            console.log('Socket message to worker to calculate move')
            console.log(payload)
            worker.postMessage(payload)
            setupWorkerMessageListener(socket, worker)
        })

        socket.on('stop-engine', async (payload) => {
            const worker = await engineService.getEngineWorker()

            console.log('Socket message to worker to stop engine')
            worker.postMessage(payload)
            setupWorkerMessageListener(socket, worker)
        })

        socket.on('disconnect', () => {
            console.log('Engine socket disconnected')
        })
    }

    server.on('connection', onConnection)
}

export default engineSocket
