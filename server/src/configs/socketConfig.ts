import { Server as SocketIOServer } from 'socket.io'
import chatSocket from '../sockets/chatSocket'
import engineSocket from '../sockets/engineSocket'
import { Server } from 'https'

const socketConfig = (httpsServer: Server) => {
    const io: SocketIOServer = new SocketIOServer(httpsServer, {
        cors: {
            origin: 'https://localhost:5173',
        },
    })
    
    const socketChat = io.of('/chat')
    const socketEngine = io.of('/engine')

    chatSocket(socketChat)
    engineSocket(socketEngine)
}

export default socketConfig
