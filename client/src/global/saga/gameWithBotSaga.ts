import { put, takeLatest, all, call, take } from 'redux-saga/effects'
import { PayloadAction, createAction } from '@reduxjs/toolkit'
import convertChessNotation from '../../hooks/convertChessNotation'
import { addMove, setConnected, setMode } from '../slices/gameSlice'

function* createGameBot(action: PayloadAction<{ mode: string }>) {
    yield console.log(213121)
    yield put(setConnected(true))
    yield put(setMode(action.payload.mode))
}

function* eventMove(action: PayloadAction<string>) {
    yield put(addMove(action.payload))
    const moveAction = createAction<string>('SEND_MOVE_ENGINE')
    yield put(moveAction(action.payload))
}

function* handleMoveEngine(action: PayloadAction<{bestMoves: string[], pawnAdvantage: number}>) {
    if (action.payload.bestMoves.length > 0) {
        const lastMove = action.payload.bestMoves[action.payload.bestMoves.length - 1]
        const coordinatesCells = convertChessNotation(lastMove)
        console.log(coordinatesCells)
        if (coordinatesCells) {
            yield put(addMove(coordinatesCells))
        }
    } else {
        console.log('dsadasdas', action.payload.bestMoves)
    }
}

function* watchBotGame() {
    yield takeLatest('ENGINE_STARTED', createGameBot)
    yield takeLatest('MOVE', eventMove)
    yield takeLatest('MOVE_ENGINE', handleMoveEngine)
}

export default function* rootSaga() {
    yield all([watchBotGame()])
}
