import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import { Figure, FigureNames } from './Figure'
import blackLogo from '..//assets/black-pawn.png'
import whiteLogo from '../assets/white-pawn.png'

export class Pawn extends Figure {
    isFirstStep = true

    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.PAWN
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.logicFigureMove(target)) return true
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1
        const firstStepDirection =
            this.cell.figure?.color === Colors.BLACK ? 2 : -2

        if (
            (target.y === this.cell.y + direction ||
                (this.isFirstStep &&
                    target.y === this.cell.y + firstStepDirection)) &&
            target.x === this.cell.x &&
            this.cell.board
                .getCell(this.cell.x, this.cell.y + direction)
                .isEmpty()
        ) {
            return true
        }
        return false
    }

    logicFigureMove(target: Cell): boolean {
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1

        if (
            target.y === this.cell.y + direction &&
            (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
        ) {
            target.underAtack.push(this.color)
            if (this.cell.isEnemy(target)) {
                return true
            }
        }
        return false
    }

    moveFigure(target: Cell) {
        super.moveFigure(target)
        this.isFirstStep = false
    }
}
