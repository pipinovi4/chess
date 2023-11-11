import { Socket } from 'socket.io-client'
import { Cell } from '../../../entites/cell/Cell'
import createChessNotation from '../../../helpers/createChessNotation'
import EngineSocketService from '../socketSevices/egnineSocketService'
import { ProcessedDataServer, ResponseServerMove } from '../types'
import convertChessNotation from '../../../helpers/convertChessNotation'
import Board from '../../../entites/board/Board'
import { Colors } from '../../../constants/Colors'

/**
 * Service for interacting with the game engine.
 */
class EngineGameService extends EngineSocketService {
    constructor() {
        super()
    }

    /**
     * Process a move and receive a response from the server.
     * @param {Cell} selectedCell - The selected cell (starting point of the move).
     * @param {Cell} targetCell - The target cell (ending point of the move).
     * @param {Socket | null} engineSocket - The socket for communicating with the engine.
     * @returns {Promise<ProcessedDataServer | null>} - Processed data from the server or null in case of an error.
     */
    async processMoveAndReceiveResponse(
        selectedCell: Cell,
        targetCell: Cell,
        engineSocket: Socket | null,
        movePlayer: Colors
    ): Promise<ProcessedDataServer | null | undefined> {
        try {
            if (selectedCell && targetCell && engineSocket) {
                const move = createChessNotation(targetCell, selectedCell)
                console.log('response')
                const serverResponse = await this.sendMoveEngine(
                    move,
                    engineSocket
                )

                console.log(serverResponse)

                if (typeof serverResponse === 'string') {
                    console.error(
                        'Error in send move egngine: ',
                        serverResponse
                    )
                }
                if (serverResponse) {
                    const processedData = this.processServerResponse(
                        serverResponse,
                        selectedCell,
                        movePlayer
                    )
                    return processedData
                }
            }
            return null
        } catch (error) {
            console.error('Unexpected error:', error)
            throw error
        }
    }

    /**
     * Process the server's response.
     * @param {ResponseServer} serverResponse - The server's response.
     * @param {Cell} selectedCell - The selected cell.
     * @returns {ProcessedDataServer | null} - Processed data from the server or null in case of an error.
     */
    private processServerResponse(
        serverResponse: ResponseServerMove,
        selectedCell: Cell,
        movePlayer: Colors
    ): ProcessedDataServer | null {
        const moveServer =
            serverResponse.bestMoves[serverResponse.currentStrokeRate]
        const moveCoordinates = convertChessNotation(moveServer)

        if (!moveCoordinates) {
            return null
        }

        const selectedCellEngine = this.getCellByCoordinates(
            selectedCell.board,
            moveCoordinates.coordinatesSelectedCell
        )
        const targetCellEngine = this.getCellByCoordinates(
            selectedCell.board,
            moveCoordinates.coordinatesTargetCell
        )

        const correctPawnAdvantage =
            movePlayer === Colors.BLACK
                ? -serverResponse.pawnAdvantage
                : serverResponse.pawnAdvantage

        if (selectedCellEngine && targetCellEngine) {
            return {
                engineMoveCells: {
                    selectedCell: selectedCellEngine,
                    targetCell: targetCellEngine,
                },
                pawnAdvantage: correctPawnAdvantage,
            }
        } else {
            return null
        }
    }

    /**
     * Get a cell by its coordinates on the board.
     * @param {Board} board - The chessboard.
     * @param {{ x: number; y: number }} coordinates - The cell coordinates.
     * @returns {Cell | null} - The cell or null if it's not found.
     */
    private getCellByCoordinates(
        board: Board,
        coordinates: { x: number; y: number }
    ): Cell | null {
        return board.getCell(coordinates.x, coordinates.y)
    }
}

export default EngineGameService
