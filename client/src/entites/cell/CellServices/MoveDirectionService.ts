import { FigureNames } from '../../figures/Figure'
import { Cell } from '../Cell'

class MoveDirectionService {
    isEmptyHorizontal(target: Cell, selectedCell: Cell): boolean {
        if (selectedCell.y !== target.y) return false

        const min = Math.min(selectedCell.x, target.x)
        const max = Math.max(selectedCell.x, target.x)

        for (let x = min + 1; x < max; x++) {
            if (
                !selectedCell.board.getCell(x, selectedCell.y).isEmpty() &&
                selectedCell.board.getCell(x, selectedCell.y).figure?.name !==
                    FigureNames.KING
            ) {
                return false
            }
        }
        return true
    }

    isEmptyDiagonal(target: Cell, selectedCell: Cell): boolean {
        const absX = Math.abs(target.x - selectedCell.x)
        const absY = Math.abs(target.y - selectedCell.y)

        if (absY !== absX) return false

        const dy = selectedCell.y < target.y ? 1 : -1
        const dx = selectedCell.x < target.x ? 1 : -1

        for (let i = 1; i < absY; i++) {
            if (
                !selectedCell.board
                    .getCell(selectedCell.x + dx * i, selectedCell.y + dy * i)
                    .isEmpty() &&
                selectedCell.board.getCell(
                    selectedCell.x + dx * i,
                    selectedCell.y + dy * i
                ).figure?.name !== FigureNames.KING
            )
                return false
        }
        return true
    }

    isEmptyVertical(target: Cell, selectedCell: Cell): boolean {
        if (selectedCell.x !== target.x) return false

        const min = Math.min(selectedCell.y, target.y)
        const max = Math.max(selectedCell.y, target.y)

        for (let y = min + 1; y < max; y++) {
            if (
                !selectedCell.board.getCell(selectedCell.x, y).isEmpty() &&
                selectedCell.board.getCell(selectedCell.x, y).figure?.name !==
                    FigureNames.KING
            ) {
                return false
            }
        }
        return true
    }
}

export default new MoveDirectionService()
