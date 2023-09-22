import { Server, Socket } from 'socket.io'

const socketConfig = (server: Server) => {
    const io = server
    const games = {}

    // Добавляем обработчик события 'connection'
    const onConnection = (socket: Socket) => {
        console.log('Client connected', socket.id);

        // socket.on('create-game', (gameId) => {
        //     games[gameId] = { players: [socket.id] }
        // })

        // Добавляем обработчик события 'disconnect' для этого сокета
        socket.on('disconnect', () => {
            console.log('Client disconnected');

            // Удаляем обработчик события 'connection' после отключения клиента
            io.off('connection', onConnection);
        });
    };

    io.on('connection', onConnection);
}

export default socketConfig