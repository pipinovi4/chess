import engineSocket from '../sockets/engineSocket'
import { Server } from 'https'
import { Server as ServerIoSocket} from 'socket.io'
import onlineGameSocket from '../sockets/onlineGameSocket'

const socketConfig = (httpsServer: Server) => {
    const serverSocket: ServerIoSocket = new ServerIoSocket(httpsServer, {
        cors: {
            origin: 'https://localhost:5173',
        },
    })
    serverSocket.on('conncetion', () => console.log('32132132121321321321'))

    const onlineGameNameSpace = serverSocket.of('/online-game')
    const engineNameSpace = serverSocket.of('/engine')

    onlineGameSocket(onlineGameNameSpace)
    engineSocket(engineNameSpace)
    
}

export default socketConfig
