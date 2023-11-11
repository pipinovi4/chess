import { Figure, FigureNames } from "../entites/figures/Figure"

/**
 * Converts captured chess pieces to a total cost in pawns.
 *
 * @param {Array<Figure>} lostFigures - An array of captured chess pieces.
 * @returns {number} The total cost of the captured pieces in pawns.
 */
const convertCapturedPieces = (lostFigures: Array<Figure>) => {
    let costInPawn = 0;
    lostFigures.forEach((capturedPiece) => {
        switch (capturedPiece.name) {
            case FigureNames.PAWN:
                costInPawn += 1;
                break;
            case FigureNames.KNIGHT || FigureNames.BISHOP:
                costInPawn += 3;
                break;
            case FigureNames.ROOK:
                costInPawn += 5;
                break;
            case FigureNames.QUEEN:
                costInPawn += 9;
                break;
        }
    });
    return costInPawn;
};

export default convertCapturedPieces;
