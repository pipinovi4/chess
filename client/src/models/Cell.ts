import { Figure, FigureNames } from '../figures/Figure'
import { Queen } from '../figures/Queen'
import { Rook } from '../figures/Rook'
import { Board } from './Board'
import { Colors } from './Colors'

export class Cell {
    readonly x: number
    readonly y: number
    readonly color: Colors
    figure: Figure | null
    board: Board
    available: boolean
    underAtack: Array<Colors> = []
    id: number

    constructor(board: Board, x: number, y: number, color: Colors) {
        this.x = x
        this.y = y
        this.color = color
        this.board = board
        this.figure = null
        this.available = false
        this.id = Math.random()
    }

    setFigure(figure: Figure) {
        this.figure = figure
        this.figure.cell = this
    }

    isEmpty(): boolean {
        return this.figure === null
    }

    isEnemy(target: Cell): boolean {
        if (target.figure) {
            return this.figure?.color !== target.figure.color
        }
        return false
    }

    isEmptyVertical(target: Cell): boolean {
        if (this.x !== target.x) return false

        const min = Math.min(this.y, target.y)
        const max = Math.max(this.y, target.y)

        for (let y = min + 1; y < max; y++) {
            if (!this.board.getCell(this.x, y).isEmpty() && this.board.getCell(this.x, y).figure?.name !== FigureNames.KING) {
                return false
            }
        }
        return true
    }

    castleMove(target: Cell) {
        const rookCell =
            target.x - this.x === 2
                ? this.board.getCell(target.x + 1, this.y)
                : this.board.getCell(target.x - 2, this.y)

        if (this.figure && rookCell.figure) {
            const newX = this.x + (target.x - this.x) / 2
            const newRookCell = this.board.getCell(newX, this.y)
            newRookCell.figure = new Rook(
                this.figure.color,
                this.board.cells[this.y][newX]
            )

            // Устанавливаем флаги isMoved для короля и ладьи
            this.figure.isMoved = true
            newRookCell.figure.isMoved = true

            // Очищаем начальные клетки
            rookCell.figure = null
        }
    }

    isEmptyHorizontal(target: Cell): boolean {
        if (this.y !== target.y) return false

        const min = Math.min(this.x, target.x)
        const max = Math.max(this.x, target.x)

        for (let x = min + 1; x < max; x++) {
            if (!this.board.getCell(x, this.y).isEmpty() && this.board.getCell(x, this.y).figure?.name !== FigureNames.KING) {
                return false
            }
        }
        return true
    }

    isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(target.x - this.x)
        const absY = Math.abs(target.y - this.y)

        if (absY !== absX) return false

        const dy = this.y < target.y ? 1 : -1
        const dx = this.x < target.x ? 1 : -1

        for (let i = 1; i < absY; i++) {
            if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty() && this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.name !== FigureNames.KING)
                return false
        }
        return true
    }

    updateCellUnderAtack() {
    this.restingCellsUnderAttack()
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const currentIterationCell = this.board.getCell(x, y)
                this.chekingAttackedCells(currentIterationCell)
            }
        }
    }

    chekingAttackedCells(cell: Cell) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board.getCell(j, i).figure) {
                    if (this.board.getCell(j, i).figure) {
                        if (
                            this.board
                                .getCell(j, i)
                                .figure?.logicFigureMove(
                                    cell
                                ) &&
                            !cell.underAtack.includes(
                                this.figure?.color
                            ) &&
                            cell !==
                                this.board.getCell(j, i)
                        ) {
                            cell.underAtack.push(
                                this.board.getCell(j, i).figure?.color
                            )
                        }
                    }
                }
            }
        }
    }

    restingCellsUnderAttack() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const currentIterationCell = this.board.getCell(i, j)
                currentIterationCell.underAtack = []
            }
        }
    }
    
    moveFigure(target: Cell) {
        if (this.figure && this.figure?.canMove(target)) {
            this.figure.moveFigure(target)
            if (
                this.figure.name === FigureNames.KING &&
                Math.abs(target.x - this.x) === 2
            ) {
                this.castleMove(target)
            }
            target.setFigure(this.figure)
            this.figure = null
            this.updateCellUnderAtack()
        }
    }
}
