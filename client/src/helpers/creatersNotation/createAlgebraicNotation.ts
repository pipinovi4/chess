import { Cell } from '../../entites/cell/Cell'
import { FigureNames } from '../../entites/figures/Figure'

/**
 * Converts chess move coordinates from system coordinates to Algebraic notation.
 *
 * @param {Cell} targetCell - The target cell object representing the destination.
 * @param {Cell} selectedCell - The selected cell object representing the starting position.
 * @returns {string} The move represented in Algebraic notation.
 */
const createChessNotation = (
    targetCell?: Cell,
    selectedCell?: Cell
): string => {
    if (targetCell === null || selectedCell === null) {
        throw new Error('Both targetCell and currentCell must be provided.')
    }
    let algebraicNotation = ''
    if (selectedCell) {
        // Convert x-coordinate to corresponding lowercase letter (a-h) in Algebraic notation
        algebraicNotation += String.fromCharCode(97 + selectedCell.x)

        // Convert y-coordinate to corresponding number (1-8) in Algebraic notation
        algebraicNotation += 8 - selectedCell.y
    }
    if (targetCell) {
        // Convert target x-coordinate to corresponding lowercase letter (a-h) in Algebraic notation
        algebraicNotation += String.fromCharCode(97 + targetCell.x)

        // Convert target y-coordinate to corresponding number (1-8) in Algebraic notation
        algebraicNotation += 8 - targetCell.y

        if (
            selectedCell?.figure?.name === FigureNames.PAWN &&
            (targetCell?.y === 0 || targetCell.y === 7)
        ) {
            algebraicNotation += `=${selectedCell.figure.promotedTo}`
        }
    }

    return algebraicNotation
}

export default createChessNotation
