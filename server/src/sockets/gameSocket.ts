import { Namespace, Socket } from 'socket.io'
import gameService from '../services/GameServices/gameService'
import gameStatus from '../types/gameStatusEnum'

const gameSocket = (server: Namespace) => {
    const onConnection = (socket: Socket) => {
        console.log(`User with id ${socket.id} connected`)

        socket.on('create-game', async () => {
            const usersSocketId: Array<string> = []

            usersSocketId.push(socket.id)
            if (usersSocketId.length === 2) {
                const gameId = await gameService.createGame(usersSocketId)
                localStorage.setItem('gameId', gameId.toString())
                socket.emit('game-created', gameId.toString())
            }
        })

        socket.on('move', async (move: string, gameId: string) => {
            const game = await gameService.updateMovesGame(move, gameId)
            const recipientUser = game.users.find(
                (usersSocketId) => usersSocketId !== socket.id
            )
            socket.to(recipientUser[0]).emit('opponentMove')
        })

        socket.on('end-game', async (status: gameStatus, gameId: string) => {
            console.log(`Game ended diferences`)
            await gameService.endGame(status, socket.id, gameId)
        })
    }

    server.on('connection', onConnection)
}

export default gameSocket
