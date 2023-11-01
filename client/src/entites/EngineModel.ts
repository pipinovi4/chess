import { Socket } from 'socket.io-client'
import EngineGameService from '../services/gameServices/gameServices/engineGameService'
import { Cell } from './cell/Cell'
import { EngineMoveCells } from '../services/gameServices/types'
import { Colors } from '../constants/Colors'
import Board from './board/Board'

/**
 * Model representing the game engine with various properties and methods.
 */
class EngineModel extends EngineGameService {
    private _connected = false
    private _pawnAdvantage: number | string = 0;
    private _engineMove: EngineMoveCells | null = null
    private _movePlayer = Math.random() > 0.5
    private _engineSocket: Socket | null = null
    private currentColorMove: Colors = Colors.WHITE

    constructor() {
        super()
    }

    /**
     * Prepare and start the game engine, establishing a socket connection.
     */
    async prepareAndStartEngine() {
        try {
            const engineSocket = await this.startEngine()
            console.log('socket')
            if (engineSocket) {
                this._engineSocket = engineSocket
                return engineSocket
            } else {
                return null
            }
        } catch (error) {
            console.error('Error:', error)
            throw error // Передаем ошибку дальше
        }
    }

    /**
     * Prepare and send a move to the game engine, updating relevant properties.
     * @param {Cell} selectedCell - The selected cell for the move.
     * @param {Cell} targetCell - The target cell for the move.
     * @returns {void} A promise that resolves when the move is sent or null in case of an error.
     */
    async prepareAndSendMoveEngine(
        selectedCell: Cell | null,
        targetCell: Cell,
        setBoard: (board: Board) => void
    ): Promise<void> {
        try {
            if (
                selectedCell &&
                targetCell &&
                selectedCell.figure?.canMove(targetCell)
            ) {
                const responseEngine = await this.processMoveAndReceiveResponse(
                    selectedCell,
                    targetCell,
                    this._engineSocket,
                    this.currentColorMove
                )
                if (responseEngine) {
                    this._pawnAdvantage = responseEngine.pawnAdvantage
                    this._engineMove = responseEngine.engineMoveCells
                    responseEngine.engineMoveCells.selectedCell.moveFigure(
                        responseEngine.engineMoveCells.targetCell
                    )
                    const copyBoard = selectedCell.board.getCopyBoard()
                    setBoard(copyBoard)
                }
            }
        } catch (error) {
            console.error('Unforeseen error')
            throw error
        }
    }

    /**
     * Prepare and stop the game engine, disconnecting the socket.
     * @returns {Promise<void>} A promise that resolves when the engine is stopped.
     */
    async prepareAndStopEngine(): Promise<void> {
        try {
            if (this._engineSocket && this._connected) {
                const isStopped = await this.stopEngine(this._engineSocket)
                if (!isStopped) {
                    console.error('Engine is not stopped')
                }
            }
        } catch (error) {
            console.error(error)
            throw error // Передаем ошибку дальше
        }
    }

    /**
     * Get the current pawn advantage.
     * @returns {number} The pawn advantage value.
     */
    getPawnAdvantage(): number | string {
        return this._pawnAdvantage
    }

    /**
     * Get the latest engine moves.
     * @returns {EngineMoveCells | null} The engine moves or null if not available.
     */
    get engineMove(): EngineMoveCells | null {
        return this._engineMove
    }

    /**
     * Get the current move player status.
     * @returns {boolean} `true` if it's the move player's turn, `false` otherwise.
     */
    get movePlayer(): boolean {
        return this._movePlayer
    }

    setCurrentColorPlayer() {
        const swifedtColor =
            this.currentColorMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        this.currentColorMove = swifedtColor
    }
}

export default EngineModel
