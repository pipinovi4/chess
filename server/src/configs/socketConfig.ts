import { Server } from 'https';
import { Server as ServerIoSocket, Socket } from 'socket.io';
import onlineGameSocket from '../sockets/onlineGameSocket';
import engineSocket from '../sockets/engineSocket';

const socketConfig = (httpsServer: Server) => {
    const serverSocket: ServerIoSocket = new ServerIoSocket(httpsServer, {
        cors: {
            origin: 'https://localhost:5173',
        },
    });

    const onlineGameNameSpace = serverSocket.of('/online-game');
    const engineNameSpace = serverSocket.of('/engine');

    onlineGameSocket(onlineGameNameSpace);
    engineSocket(engineNameSpace);
}

export default socketConfig;
