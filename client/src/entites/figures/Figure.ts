import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import logo from '../../assets/bishop-black.png'

export enum FigureNames {
    FIGURE = 'Фигура',
    KING = 'Король',
    KNIGHT = 'Конь',
    PAWN = 'Пешка',
    QUEEN = 'Ферзь',
    ROOK = 'Ладья',
    BISHOP = 'Слон',
}

export class Figure {
    color: Colors
    logo: typeof logo | null
    cell: Cell
    name: FigureNames
    hasMovedFlag = false
    isMoved = false
    kingAttacked = false
    prevCellAttacked: number[][] = []
    canMoves: Array<Cell> = []

    constructor(color: Colors, cell: Cell) {
        this.color = color
        this.cell = cell
        this.cell.figure = this
        this.logo = null
        this.name = FigureNames.FIGURE
    }

    canMove(target: Cell): boolean {
        if (target.figure?.color === this.color) return false
        if (target.figure?.name === FigureNames.KING) {
            return false
        }
        return true
    }

    logicFigureMove(target: Cell) {}

    moveFigure(target: Cell) {}
}
