"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatSocket = (server) => {
    const io = server;
    const clients = {};
    const onConnection = (socket) => {
        socket.on('new-user', ({ userName }) => {
            console.log(213213);
            socket.broadcast.emit('update', userName + "joined the consersation");
        });
        socket.on('exit-user', ({ userName }) => {
            console.log(213213);
            socket.broadcast.emit('update', userName + "left the consersation");
        });
        socket.on('chat-server', (message) => {
            console.log('user with socket id:', socket.id, 'send message');
            console.log('chat-connect yet');
            io.emit('chat', message);
        });
    };
    io.on('connection', onConnection);
};
exports.default = chatSocket;
//# sourceMappingURL=chatSocket.js.map