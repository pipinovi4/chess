import { Server, Socket } from 'socket.io';

const chatSocket = (server: Server) => {
    const io = server;

    // Об'єкт для зберігання підключених клієнтів та їх імен
    const clients: Record<string, string> = {};

    // Добавляем обработчик события 'connection'
    const onConnection = (socket: Socket) => {
        socket.on('new-user', ({userName}) => {
            console.log(213213)
            socket.broadcast.emit('update', userName + "joined the consersation");
        })

        socket.on('exit-user', ({userName}) => {
            console.log(213213)
            socket.broadcast.emit('update', userName + "left the consersation");
        })

        socket.on('chat-server', (message) => {
            console.log('user with socket id:', socket.id, 'send message')
            console.log('chat-connect yet')
            io.emit('chat', message);
        })
    }

    io.on('connection', onConnection);
};

export default chatSocket;
