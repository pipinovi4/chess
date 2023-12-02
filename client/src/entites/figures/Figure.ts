/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import logo from '../../assets/bishop-black.png'
import KingAttackService from '../cell/CellServices/KingAttackService'
import * as uuid from 'uuid'

export enum FigureNames {
    FIGURE = 'Figure',
    KING = 'King',
    KNIGHT = 'Knight',
    PAWN = 'Pawn',
    QUEEN = 'Queen',
    ROOK = 'Rook',
    BISHOP = 'Bishop',
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
    id: string = uuid.v4()
    promotedTo: string | null

    constructor(color: Colors, cell: Cell) {
        this.color = color
        this.cell = cell
        this.cell.figure = this
        this.logo = null
        this.name = FigureNames.FIGURE
        this.promotedTo = null
    }

    canMove(target: Cell): boolean {
        if (target.figure?.name === FigureNames.KING) return false
        if (target.figure?.color === this.color) return false
        if (!KingAttackService.validateMoveUnderCheck(target, this.cell))
            return false

        return true
    }

    logicFigureMove(_target: Cell): boolean {
        if (_target.figure?.color === this.color) return false
        return true
    }

    moveFigure(_target: Cell) {}
}
