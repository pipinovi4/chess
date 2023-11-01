import { Socket } from 'socket.io'
import { Namespace } from 'socket.io'
import OnlineGameModel from '../models/customModels/OnlineGameModel'

const onlineGameSocket = (server: Namespace) => {
    const onConnection = (socket: Socket) => {
        let onlineGame: OnlineGameModel | null = null

        // Event handler for when a user initiates an online game
        socket.on('start-online-game', async () => {
            try {
                // Create a new OnlineGameModel instance for the user
                onlineGame = new OnlineGameModel(socket)
                // Prepare and start the online game for the user
                await onlineGame.prepareAndStartOnlineGame(socket.id, server)

                // Event handler for when the user makes a game move
                socket.on('game-move', async (move) => {
                    try {
                        // Receive and process the opponent's move
                        await onlineGame?.receiveMove(move, socket)
                    } catch (error) {
                        console.error(
                            'Error while receiving opponent move:',
                            error.message
                        )
                    }
                })
            } catch (error) {
                console.error(
                    'Error while starting an online game:',
                    error.message
                )
            }
        })

        // Event handler for when the user sends a game move to the opponent
        socket.on('send-move', async (move: string) => {
            try {
                // Prepare and send the user's move to the opponent
                await onlineGame?.prepareAndSendMove(move, server)
            } catch (error) {
                console.error('Error while sending a move:', error.message)
            }
        })

        // Event handler for when the user stops the online game
        socket.on('stop-online-game', async () => {
            try {
                // Stop the online game
                await onlineGame?.prepareAndStopGame(server)
            } catch (error) {
                console.error(
                    'Error while stopping the online game:',
                    error.message
                )
            }
        })

        // Event handler for when the user's socket connection is closed
        socket.on('close', async () => {
            console.log('Socket connection lost for socket id: ', socket.id)
            if (onlineGame) {
                try {
                    // Stop the online game if it was in progress
                    await onlineGame.prepareAndStopGame(server)
                } catch (error) {
                    console.error(
                        'Error while stopping the online game:',
                        error.message
                    )
                }
            }
        })
    }

    // Listen for socket connections on the provided server
    server.on('connection', onConnection)
}

export default onlineGameSocket
