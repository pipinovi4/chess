import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import { Figure, FigureNames } from './Figure'
import whiteLogo from '../../assets/white-queen.png'
import blackLogo from '../../assets/black-queen.png'
import MoveDirectionService from '../cell/CellServices/MoveDirectionService'

export class Queen extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.QUEEN
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.logicFigureMove(target)) return true
        return false
    }

    logicFigureMove(target: Cell): boolean {
        if (MoveDirectionService.isEmptyVertical(target, this.cell)) return true
        if (MoveDirectionService.isEmptyHorizontal(target, this.cell)) return true
        if (MoveDirectionService.isEmptyDiagonal(target, this.cell)) return true
        return false
    }
}
