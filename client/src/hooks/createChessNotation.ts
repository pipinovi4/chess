import { Cell } from '../entites/cell/Cell';

/**
 * Converts chess move coordinates from system coordinates to Algebraic notation.
 * 
 * @param {Cell} targetCell - The target cell object representing the destination.
 * @param {Cell} currentCell - The current cell object representing the starting position.
 * @returns {string} The move represented in Algebraic notation.
 */
const createChessNotation = (targetCell: Cell, currentCell: Cell): string => {
    if (targetCell === null || currentCell === null) {
        throw new Error('Both targetCell and currentCell must be provided.');
    }
    let algebraicNotation = '';

    // Convert x-coordinate to corresponding lowercase letter (a-h) in Algebraic notation
    algebraicNotation += String.fromCharCode(97 + currentCell.x);

    // Convert y-coordinate to corresponding number (1-8) in Algebraic notation
    algebraicNotation += 8 - currentCell.y;

    // Convert target x-coordinate to corresponding lowercase letter (a-h) in Algebraic notation
    algebraicNotation += String.fromCharCode(97 + targetCell.x);

    // Convert target y-coordinate to corresponding number (1-8) in Algebraic notation
    algebraicNotation += 8 - targetCell.y;

    return algebraicNotation;
};

export default createChessNotation;
