/* eslint-disable @typescript-eslint/ban-types */
import _ from 'lodash'
import Board from '../../board/Board'
import { FigureNames } from '../../figures/Figure'
import { Cell } from '../Cell'

class KingAttackService {
    updateCellUnderAttack(board: Board) {
        this.resetCellsUnderAttack(board)
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const currentIterationCell = board.getCell(x, y)
                if (currentIterationCell.figure) {
                    this.checkingAttackedCells(currentIterationCell, board)
                }
            }
        }
    }

    checkingAttackedCells(selectedCell: Cell, board: Board) {
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
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
                    targetCell.underAtack.push(selectedCell.figure.color)
                }
            }
        }
    }

    resetCellsUnderAttack(board: Board) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const currentIterationCell = board.getCell(i, j)
                currentIterationCell.underAtack = []
                board.kingCheckCell = null
            }
        }
    }

    validateMoveUnderCheck(targetCell: Cell, selectedCell: Cell) {
        if (selectedCell.figure?.name === FigureNames.KING) return true
        if (
            selectedCell.figure &&
            selectedCell.figure.logicFigureMove(targetCell)
        ) {
            const virtualBoard = _.cloneDeep(targetCell.board)
            console.log('virtual board exsists')
            if (selectedCell.figure?.logicFigureMove(targetCell)) {
                console.log('selected cell figure ex')
                const virtualSelectedCell = virtualBoard.getCell(
                    selectedCell.x,
                    selectedCell.y
                )
                const virtualTargetCell = virtualBoard.getCell(
                    targetCell.x,
                    targetCell.y
                )
                console.log(virtualSelectedCell, virtualTargetCell)
                if (virtualSelectedCell.figure && virtualTargetCell) {
                    console.log('virtual cells')
                    const copy = _.cloneDeep(virtualBoard.kingCheckCell)
                    virtualTargetCell.setFigure(virtualSelectedCell.figure)
                    virtualSelectedCell.figure = null
                    this.updateCellUnderAttack(virtualBoard)
                    if (copy && virtualBoard.kingCheckCell && copy.figure?.color !== virtualBoard.kingCheckCell?.figure?.color) return false
                    if (
                        virtualBoard.kingCheckCell &&
                        virtualBoard.kingCheckCell.figure?.color !==
                            selectedCell.figure.color
                    )
                        return true
                    if (virtualBoard.kingCheckCell) return false
                }
            }
        }
        return true
    }
}

export default new KingAttackService()
