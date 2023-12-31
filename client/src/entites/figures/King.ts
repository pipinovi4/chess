import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import { Figure, FigureNames } from './Figure'
import blackLogo from '../../assets/black-king.png'
import whiteLogo from '../../assets/white-king.png'
import { Rook } from './Rook'
import getOponentColor from './helper/getOponentColors'

export class King extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.KING
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.logicFigureMove(target)) return true
        return false
    }

    logicFigureMove(target: Cell): boolean {
        if (this.canCastle(target)) return true
        if (!target.underAtack.includes(getOponentColor(this))) {
            const xDiff = Math.abs(this.cell.x - target.x)
            const yDiff = Math.abs(this.cell.y - target.y)

            if (xDiff <= 1 && yDiff <= 1) return true
        }
        return false
    }

    canCastle(target: Cell): boolean {
        if (
            !this.cell.figure?.isMoved &&
            !this.cell.underAtack.includes(getOponentColor(this)) &&
            target.y === this.cell.y &&
            Math.abs(this.cell.x - target.x) === 2
        ) {
            if (target.x > this.cell.x) {
                for (let x = this.cell.x + 1; x < target.x; x++) {
                    const intermediateCell = this.cell.board.getCell(
                        x,
                        this.cell.y
                    )
                    if (
                        !intermediateCell.isEmpty() ||
                        intermediateCell.underAtack.includes(
                            getOponentColor(this)
                        )
                    ) {
                        return false
                    }
                }
                const rookCell = this.cell.board.getCell(
                    target.x + 1,
                    this.cell.y
                )
                if (
                    !rookCell.isEmpty() &&
                    rookCell.figure instanceof Rook &&
                    !rookCell.figure.isMoved
                ) {
                    return true
                }
            } else {
                for (let x = this.cell.x - 1; x > target.x; x--) {
                    const intermediateCell = this.cell.board.getCell(
                        x,
                        this.cell.y
                    )
                    if (!intermediateCell.isEmpty()) {
                        return false
                    }
                    if (
                        intermediateCell.underAtack.includes(
                            getOponentColor(this)
                        )
                    ) {
                        return false
                    }
                }
                const rookCell = this.cell.board.getCell(
                    target.x - 2,
                    this.cell.y
                )
                if (
                    !rookCell.isEmpty() &&
                    rookCell.figure instanceof Rook &&
                    !rookCell.figure.isMoved
                ) {
                    return true
                }
            }
        }
        return false
    }

    moveFigure(target: Cell): void {
        super.moveFigure(target)
        this.isMoved = true
    }
}
