import { Cell } from '../cell/Cell'
import { Colors } from '../../constants/Colors'
import { Figure, FigureNames } from './Figure'
import blackLogo from '../../assets/black-bishop.png'
import whiteLogo from '../../assets/white-bishop.png'
import MoveDirectionService from '../cell/CellServices/MoveDirectionService'

export class Bishop extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell)
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo
        this.name = FigureNames.BISHOP
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false
        if (this.logicFigureMove(target)) return true
        return false
    }

    logicFigureMove(target: Cell): boolean {
        if (MoveDirectionService.isEmptyDiagonal(target, this.cell)) return true
        return false
    }
}
