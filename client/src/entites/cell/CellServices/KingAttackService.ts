/* eslint-disable @typescript-eslint/ban-types */
import { Colors } from '../../../constants/Colors'
import Board from '../../board/Board'
import { FigureNames } from '../../figures/Figure'
import getOponentColor from '../../figures/helper/getOponentColors'
import { Cell } from '../Cell'
import _ from 'lodash'

class KingAttackService {
    updateCellUnderAtack(board: Board) {
        this.restingCellsUnderAttack(board)
        for (let x = 0; x !== 8; x++) {
            for (let y = 0; y !== 8; y++) {
                const currentIterationCell = board.getCell(x, y)
                if (currentIterationCell.figure) {
                    this.chekingAttackedCells(currentIterationCell, board)
                }
            }
        }
    }

    chekingAttackedCells(selectedCell: Cell, board: Board) {
        for (let j = 0; j !== 8; j++) {
            for (let i = 0; i !== 8; i++) {
                const targetCell = board.getCell(i, j)
                if (
                    selectedCell.figure?.logicFigureMove(targetCell) &&
                    selectedCell !== targetCell
                ) {
                    if (
                        targetCell.figure?.name === FigureNames.KING &&
                        selectedCell.figure.color !== targetCell.figure.color
                    ) {
                        selectedCell.board.kingCheckCell = targetCell
                    }
                    targetCell.underAtack = [
                        ...targetCell.underAtack,
                        selectedCell.figure.color,
                    ]
                }
            }
        }
    }

    restingCellsUnderAttack(board: Board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const currentIterationCell = board.getCell(i, j)
                currentIterationCell.underAtack = []
                board.kingCheckCell = null
            }
        }
    }

    validateMoveUnderCheck(targetCell: Cell, selectedCell: Cell) {
        
        if (targetCell && selectedCell) {
            const virtualBoard = _.cloneDeep(selectedCell.board)

            const virtualSelectedCell = virtualBoard.getCell(
                selectedCell.x,
                selectedCell.y
            )
            const virtualTargetCell = virtualBoard.getCell(
                targetCell.x,
                targetCell.y
            )

            if (
                virtualSelectedCell.figure &&
                selectedCell.figure?.logicFigureMove(targetCell)
            ) {
                virtualSelectedCell
                    .figure?.moveFigure(virtualTargetCell)
                virtualTargetCell.setFigure(virtualSelectedCell.figure)
                virtualSelectedCell.figure = null
                this.updateCellUnderAtack(virtualBoard)
                if (selectedCell.figure && selectedCell.figure.color !== virtualBoard.kingCheckCell?.figure?.color  ) return true
                if (!virtualBoard.kingCheckCell) {
                    return true
                }
            }
            return false
        }
        return true
    }
}

export default new KingAttackService()
