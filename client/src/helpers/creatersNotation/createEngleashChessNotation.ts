import { Cell } from '../../entites/cell/Cell'
import { Figure, FigureNames } from '../../entites/figures/Figure'

/**
 * Converts chess moves from a selected cell to a target cell into engleash notation.
 *
 * @param {Cell} selectedCell - The selected cell containing the figure making the move.
 * @param {Cell} targetCell - The target cell where the figure is moving to.
 * @returns {{
 *   engleashNotation: string,
 *   figuresLogo: { selectedFigureLogo: string | undefined, targetFigureLogo: string }
 * }} The result of the reshaping is an English notation with figure logos.
 * @throws {Error} Throws an error if either targetCell or selectedCell is null.
 */
const convertEngleashChessNotation = (
    selectedCell: Cell,
    targetCell: Cell
): {
    engleashNotation: string
    selectedFigureLogo: string | undefined | null
} => {
    const convertResult = {
        engleashNotation: '',
        selectedFigureLogo: '',
    }

    if (
        selectedCell.figure?.name === FigureNames.KING &&
        selectedCell.x - targetCell.x === -2
    ) {
        convertResult.engleashNotation = 'O-O'
        return convertResult
    } else if (
        selectedCell.figure?.name === FigureNames.KING &&
        selectedCell.x - targetCell.x === 2
    ) {
        convertResult.engleashNotation = 'O-O-O'
        return convertResult
    }

    if (targetCell.figure && selectedCell.figure?.name === FigureNames.PAWN) {
        convertResult.engleashNotation += `${String.fromCharCode(
            97 + selectedCell.x
        )}x`
    } else if (targetCell.figure) {
        convertResult.engleashNotation += 'x'
    }

    if (
        selectedCell.figure?.logo &&
        selectedCell.figure?.name !== FigureNames.PAWN
    ) {
        convertResult.selectedFigureLogo = selectedCell.figure.logo
    }

    if (targetCell === null || selectedCell === null) {
        throw new Error('Both targetCell and currentCell must be provided.')
    }

    convertResult.engleashNotation += String.fromCharCode(97 + targetCell.x)
    convertResult.engleashNotation += 8 - targetCell.y

    if (
        selectedCell.board.kingCheckCell &&
        selectedCell.board.kingCheckCell?.figure?.color !==
            selectedCell.figure?.color
    ) {
        convertResult.engleashNotation += '+'
    }

    return convertResult
}

export default convertEngleashChessNotation
