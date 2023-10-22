import { Socket } from 'socket.io'
import { Worker } from 'worker_threads'
import chalk from 'chalk'

const setupWorkerMessageListener = (socket: Socket, worker: Worker) => {
    if (!worker) {
        console.error(chalk.bgRed('Worker is undefined'))
        return
    }
    worker.on('message', (payload: any) => {
        //New object without a message to send to the client.
        const payloadWithoutMessage = { ...payload }
        delete payloadWithoutMessage.message

        switch (payload.message) {
            case 'ENGINE_STARTED':
                console.log(chalk.bgGreen('listener', JSON.stringify(payloadWithoutMessage, null, 2)))
                socket.emit('engine-started', payloadWithoutMessage)
                break
            case 'ENGINE_STOPPED':
                console.log(chalk.bgGreen('listener', JSON.stringify(payloadWithoutMessage, null, 2)))
                console.log(payloadWithoutMessage)
                socket.emit('engine-stopped', payloadWithoutMessage)
                break
            case 'MOVE_CALCULATED':
                console.log(chalk.bgGreen('listener', JSON.stringify(payloadWithoutMessage, null, 2)))
                socket.emit('move-calculated', payloadWithoutMessage)
                break
        }
    })
}

export default setupWorkerMessageListener
