import { coordinatesCells } from '../types'

/**
 * Converts Chess Algebraic notation to the current coordinate system.
 *
 * The current coordinate system is assumed to have the following format:
 * The x coordinate is represented by a number from 0 to 7, where x is horizontals from left to right,
 * The y coordinate is represented by a number from 0 to 7, where y is verticals from top to bottom.
 *
 * For example, the coordinate (1, 1) corresponds to the top-left cell on a chessboard.
 * Converts a chess move in algebraic notation to coordinates.
 * @param {string} move - The chess move in algebraic notation (e.g., "e2e4").
 * @returns {coordinatesCells | null} An object containing the selected and target cell coordinates, or null if the move is invalid.
 */
const convertAlgebraicNotation = (move: string): coordinatesCells | null => {
    // Check if the provided move follows the correct format
    if (!move.match(/^[a-h][1-8][a-h][1-8]$/)) {
        console.error('The move sent from the server is incorrect.')
        return null
    }

    // Extract coordinates from the move
    const regexSelectedCell = /[a-h][1-8]/g
    const matches = move.match(regexSelectedCell)

    // Ensure there are two matches
    if (matches && matches.length === 2) {
        // Calculate coordinates for the selected cell
        const coordinatesSelectedCell = {
            x: matches[0].charCodeAt(0) - 'a'.charCodeAt(0),
            y: 8 - parseInt(matches[0][1]),
        }
        // Calculate coordinates for the target cell
        const coordinatesTargetCell = {
            x: matches[1].charCodeAt(0) - 'a'.charCodeAt(0),
            y: 8 - parseInt(matches[1][1]),
        }

        return {
            selectedCell: coordinatesSelectedCell,
            targetCell: coordinatesTargetCell,
        }
    } else {
        console.error('Move in convert is invalid')
        return null
    }
}

export default convertAlgebraicNotation
