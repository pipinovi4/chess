"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatSocket = (server) => {
    const clients = {};
    const onConnection = (socket) => {
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
            server.emit('chat', message);
        });
    };
    server.on('connection', onConnection);
};
exports.default = chatSocket;
