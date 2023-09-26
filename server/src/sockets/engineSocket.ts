import { Server, Socket } from 'socket.io'
import workerConfig from '../configs/workerConfig'

const engineSocket = (server: Server) => {
    server.on('connect', (socket: Socket) => {
        console.log(32131)

        // Handle errors in the socket connection
        socket.on('error', (error) => {
            console.error('Socket error:', error)
        })

        socket.on('start-engine', (payload) => {
            try {
                workerConfig('start-engine', payload)
            } catch (error) {
                console.error('Error starting engine:', error)
            }
        })

        socket.on('started-engine', () => {
            try {
                socket.emit('started-engine')
            } catch (error) {
                console.error('Error emitting "started-engine" event:', error)
            }
        })

        socket.on('calculate-move', (payload) => {
            try {
                workerConfig('calculate-move', payload)
            } catch (error) {
                console.error('Error triggering calculate move:', error)
            }
        })

        socket.on('stop-engine', (payload) => {
            try {
                workerConfig('stop-engine', payload)
            } catch (error) {
                console.error('Error engine has not stopped:', error)
            }
        })

        socket.on('disconnect', () => {
            console.log('Engine socket disconnected')
        })
    })
}

export default engineSocket
