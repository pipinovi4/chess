import { Socket } from 'socket.io'
import { Namespace } from 'socket.io'
import OnlineGameModel from '../models/customModels/OnlineGameModel'
import { Types } from 'mongoose'
import CustomOnlineGameSocket from './CustomSockets/types/TypesCustomSockets'
import { addCustomMethods } from './CustomSockets/CustomMethods/CustomMethodOnlineGameSocket'

const onlineGameSocket = (server: Namespace) => {
    const onConnection = (socket: CustomOnlineGameSocket) => {
        let onlineGame: OnlineGameModel | null = null

        // Event handler for when a user initiates an online game
        socket.on('start-online-game', async () => {
            try {
                onlineGame = new OnlineGameModel(socket)
                addCustomMethods(socket, onlineGame)
                await onlineGame.prepareAndStartOnlineGame(server, socket)
            } catch (error) {
                console.error(
                    'Error while starting an online game:',
                    error.message
                )
                throw error
            }
        })

        socket.on('send-move-opponent', async (move: string) => {
            try {
                await onlineGame.processingGameMove(move, server)
            } catch (error) {
                throw new Error('Error when trying send move to opponent: ', error)
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
