import { Socket } from "socket.io"
import { Worker } from "worker_threads"

const setupWorkerMessageListener = (socket: Socket, worker: Worker) => {
    worker.on('message', (messagePayload: any) => {
        socket.emit(messagePayload.message, messagePayload)
    })
}

export default setupWorkerMessageListener
