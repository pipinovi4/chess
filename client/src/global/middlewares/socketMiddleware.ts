import { Middleware, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import { createGameOnlineAction, handleMoveEngine } from '../actions'
import { io } from 'socket.io-client'

const socket = io('https://localhost:5000/engine')

const socketMiddleware = (): Middleware => {
    return (api) => (next: Dispatch) => (action: PayloadAction<any>) => {
        next(action)
        switch (action.type) {
            case 'CREATE_GAME_BOT':
                socket.emit('start-engine', { mode: action.payload.mode })
                socket.once('engine-started', () => {
                    console.log('engine-started')
                })
                socket.on(
                    'move-calculated',
                    (data: {
                        bestMoves: string[]
                        pawnAdvantage: number
                    }) => {
                        console.log(data)
                        return api.dispatch(handleMoveEngine(data))
                    }
                )
                break
            case 'SEND_MOVE_ENGINE':
                socket.emit('calculate-move', action.payload)
                console.log('move', action.payload)
                break
            case 'CREATE_GAME_ONLINE':
                socket.emit('join-search-queue', {
                    mode: action.payload.mode,
                })
                socket.once('opponent-found', () => {
                    api.dispatch(createGameOnlineAction())
                })
                break
        }
    }
}

export default socketMiddleware
