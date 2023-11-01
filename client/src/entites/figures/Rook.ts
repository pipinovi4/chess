import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import { Figure, FigureNames } from './Figure'
import blackLogo from '../../assets/black-rook.png'
import whiteLogo from '../../assets/white-rook.png'
import MoveDirectionService from '../cell/CellServices/MoveDirectionService'

export class Rook extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.ROOK
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.logicFigureMove(target)) return true
        return false
    }

    logicFigureMove(target: Cell): boolean {
        if (MoveDirectionService.isEmptyHorizontal(target, this.cell)) return true
        if (MoveDirectionService.isEmptyVertical(target, this.cell)) return true
        return false
    }
}
