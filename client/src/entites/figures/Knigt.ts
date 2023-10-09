import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import { Figure, FigureNames } from './Figure'
import blackLogo from '../../assets/black-knight.png'
import whiteLogo from '../../assets/white-knight.png'

export class Knight extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.KNIGHT
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.logicFigureMove(target)) return true
        return false
    }

    logicFigureMove(target: Cell): boolean {
        const dx = Math.abs(this.cell.x - target.x)
        const dy = Math.abs(this.cell.y - target.y)

        if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
            return true
        }
        return false
    }
}
