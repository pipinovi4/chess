import { Namespace, Server, Socket } from 'socket.io';

const chatSocket = (socket: Socket) => {
    const clients: Record<string, string> = {};

        socket.on('new-user', ({ userName }) => {
            console.log(213213);
            socket.to(socket.id).emit('update', userName + ' joined the conversation');
        });

        socket.on('exit-user', ({ userName }) => {
            console.log(213213);
            const connectedClients = Object.values(clients);
            socket.to(connectedClients).emit('update', userName + ' left the conversation');
        });

        socket.on('chat-server', (message) => {
            console.log('user with socket id:', socket.id, 'send message');
            console.log('chat-connect yet');
        });
};

export default chatSocket;
