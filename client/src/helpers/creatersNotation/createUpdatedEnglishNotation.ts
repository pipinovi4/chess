import Board from '../../entites/board/Board'
import { Cell } from '../../entites/cell/Cell'
import { Figure, FigureNames } from '../../entites/figures/Figure'

const createUpdatedEngleashNotation = (
    selectedCell: Cell,
    targetCell: Cell,
    board: Board,
    promotedTo?: string | null
): string => {
    let updatedEngleashNotation = ''

    if (
        selectedCell.figure?.name === FigureNames.KING &&
        selectedCell.x - targetCell.x === -2
    ) {
        updatedEngleashNotation += 'O-O'
        return updatedEngleashNotation
    } else if (
        selectedCell.figure?.name === FigureNames.KING &&
        selectedCell.x - targetCell.x === 2
    ) {
        updatedEngleashNotation += 'O-O-O'
        return updatedEngleashNotation
    }

    if (!promotedTo) {
        updatedEngleashNotation += getFirstLetterFigure(selectedCell.figure)
    }

    updatedEngleashNotation += String.fromCharCode(97 + selectedCell.x)
    updatedEngleashNotation += 8 - selectedCell.y

    if (targetCell.figure) {
        updatedEngleashNotation += `x${targetCell.figure.name[0]}`
    }

    updatedEngleashNotation += String.fromCharCode(97 + targetCell.x)
    updatedEngleashNotation += 8 - targetCell.y

    if (promotedTo) {
        updatedEngleashNotation += `=`.concat(promotedTo)
    }

    if (
        board.kingCheckCell &&
        board.kingCheckCell?.figure?.color !== selectedCell.figure?.color
    ) {
        updatedEngleashNotation += '+'
    }
    if (selectedCell.figure) selectedCell.figure.promotedTo = null
    return updatedEngleashNotation
}

const getFirstLetterFigure = (selectedFigure: Figure | null) => {
    if (
        selectedFigure?.name !== FigureNames.PAWN &&
        selectedFigure?.name !== FigureNames.KNIGHT
    ) {
        return selectedFigure?.name[0]
    } else if (selectedFigure?.name === FigureNames.KNIGHT) {
        return 'N'
    } else {
        return ''
    }
}

export default createUpdatedEngleashNotation
