import { createAction } from "@reduxjs/toolkit"
import Board from "../entites/board/Board"

export interface botGamePayload {
    mode: string
}

export const createGameBotAction = createAction<botGamePayload>('CREATE_GAME_BOT')
export const createGameOnlineAction = createAction('CREATE_GAME_ANALIS')
export const handleMoveEngine = createAction<{bestMoves: string[], pawnAdvantage: number}>('MOVE_ENGINE')