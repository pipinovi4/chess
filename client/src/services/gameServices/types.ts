import { Cell } from '../../entites/cell/Cell'

/**
 * Interface for the response from sending a move to the game engine.
 */
export interface ResponseServer {
    bestMoves: string
    pawnAdvantage: number
}

export interface ProcessedDataServer {
    engineMoveCells: EngineMoveCells
    pawnAdvantage: number
}

export interface EngineMoveCells {
    selectedCell: Cell
    targetCell: Cell
}
