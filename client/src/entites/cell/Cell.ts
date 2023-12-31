import { Figure, FigureNames } from '../figures/Figure'
import { Rook } from '../figures/Rook'
import Board from '../board/Board'
import { Colors } from '../../constants/Colors'
import KingAttackService from './CellServices/KingAttackService'
import createUpdatedEnglishNotation from '../../helpers/creatersNotation/createUpdatedEnglishNotation'
import _ from 'lodash'
import { RefObject } from 'react'

export class Cell {
    readonly x: number
    readonly y: number
    figure: Figure | null
    board: Board
    available: boolean
    underAtack: Array<Colors> = []
    ref: RefObject<HTMLDivElement> | null = null
    id: number

    constructor(board: Board, x: number, y: number) {
        this.x = x
        this.y = y
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

    validateAndMadeCastle(target: Cell) {
        if (
            this.figure?.name === FigureNames.KING &&
            Math.abs(target.x - this.x) === 2
        ) {
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

                this.figure.isMoved = true
                newRookCell.figure.isMoved = true

                rookCell.figure = null
            }
        }
    }

    moveFigure(target: Cell) {
        if (this.figure && this.figure?.canMove(target)) {
            if (target.figure) {
                this.board.lostFigures.push(target.figure)
                console.log(this.board.lostFigures)
            }
            const copySelectedCell = _.cloneDeep(this)
            const copyTargetCell = _.cloneDeep(target)
            this.validateAndMadeCastle(target)
            this.figure.moveFigure(target)
            target.setFigure(this.figure)
            this.figure = null
            KingAttackService.updateCellsUnderAttack(this.board)
            const advancedEngleashNotation = createUpdatedEnglishNotation(
                copySelectedCell,
                copyTargetCell,
                this.board,
                copySelectedCell.figure?.promotedTo
            )
            this.board.historyMoves.push(advancedEngleashNotation)
            if (this.board.kingCheckCell)
                KingAttackService.validateCheckMate(this.board)
        }
    }
}
