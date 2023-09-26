import { Server } from 'socket.io'
import chatSocket from '../sockets/chatSocket'
import engineSocket from '../sockets/engineSocket'

const socketConfig = (io: Server) => {
    chatSocket(io)
    console.log('last')
}

export default socketConfig
