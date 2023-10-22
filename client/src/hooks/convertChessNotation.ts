import { coordinate, coordinatesCells } from "../global/types/sliceStatesTypes"

/**
 * Converts Chess Algebraic notation to the current coordinate system.
 *
 * @param {string} move - The move in algebraic notation.
 * @returns {object|null} An object with selected and target coordinates in the current coordinate system,
 * or null if the move is invalid or doesn't match the expected format.
 *
 * The current coordinate system is assumed to have the following format:
 * The x coordinate is represented by a number from 0 to 7, where x is horizontals from left to right,
 * The y coordinate is represented by a number from 0 to 7, where y is verticals from top to bottom.
 *
 * For example, the coordinate (1, 1) corresponds to the top-left cell on a chessboard.
 */
const convertChessNotation = (move: string): coordinatesCells | null => {
    if (!move.match(/^[a-h][1-8][a-h][1-8]$/)) {
        console.error('The move sent from the server is incorrect.')
    }
    
    // Define regular expressions to match selected and target cells coordinates in Algebraic notation
    const regexSelectedCell = /[a-h][1-8]/;
    const regexTargetCell = /[a-h][1-8]/;    

    // Use regular expressions to extract selected and target cell coordinates data from the move
    const matchSelectedCell = move.match(regexSelectedCell)
    const matchTargetCell = move.match(regexTargetCell)

    // If both selected and target cells coordinates are found, create and return an object
    // with selected and target cells coordinates
    if (matchTargetCell && matchSelectedCell) {
        //stroke string in algebraic notation convert to system coordinate system 
        const coordinatesSelectedCell: coordinate = {
            x: matchSelectedCell[1][0].charCodeAt(0) - 'a'.charCodeAt(0),
            y: parseInt(matchSelectedCell[1][1]),
        }
        const coordinatesTargetCell: coordinate = {
            x: matchTargetCell[1][0].charCodeAt(0) - 'a'.charCodeAt(0),
            y: parseInt(matchTargetCell[1][1]),
        }
        console.log(coordinatesSelectedCell, coordinatesTargetCell)
        return {
            coordinatesSelectedCell,
            coordinatesTargetCell,
        }
    }

    // If the move is invalid or doesn't match the expected format, return null
    return null
}

export default convertChessNotation
