import { Colors } from '../../constants/Colors'
import Board from '../board/Board'
import { Cell } from '../cell/Cell'

/**
 * Game model. Manages the game state, the board, and player actions.
 */
class GameModel {
    public selectedCell: Cell | null = null
    public board: Board | null = null
    private checkCell: Cell | null = null
    private checkMate = false
    private currentPlayerColor: Colors = Colors.BLACK

    /**
     * Initializes the game board.
     */
    public initBoard() {
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        this.setBoard(newBoard)
        return newBoard
    }

    /**
     * Updates the game board.
     */
    public updateBoard() {
        const board = this.board?.getCopyBoard()
        if (board) {
            this.board = board
        }
    }

    /**
     * Highlights cells on the board based on the selected cell.
     */
    public highlightCells = (board: Board) => {
            board.highlightCells(this.selectedCell)
            this.updateBoard()
    }

    protected setBoard(board: Board) {
        if (board) {
            this.board = board
        } else {
            console.error('Board is not updated, board is undefined')
        }
    }

    protected setCurrentPlayerColors() {
        this.currentPlayerColor =
            this.currentPlayerColor === Colors.WHITE
                ? Colors.BLACK
                : Colors.WHITE
    }

    protected setCheckMate() {
        this.checkMate = !this.checkMate
    }

    public setSelectedCell(cell: Cell | null) {
        this.selectedCell = cell
    }

    protected setCheckCell(cell: Cell) {
        if (cell) {
            this.checkCell = cell
        } else {
            this.checkCell = null
            console.error(
                'When trying to change the check cell, the passed cell was undefined'
            )
        }
    }
}

export default GameModel
