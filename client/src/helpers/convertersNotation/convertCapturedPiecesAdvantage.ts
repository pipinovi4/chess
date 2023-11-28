import { Colors } from '../../constants/Colors'
import { Figure } from '../../entites/figures/Figure'

/**
 * Converts captured chess pieces to a total cost in pawns.
 *
 * @param {Array<Figure>} lostFigures - An array of captured chess pieces.
 * @returns Returns the number which is the difference between the value of the pieces in pawns, if the number is negative then Black's superiority, if the number is positive then White's superiority.
 */
const convertCapturedPiecesAdvantage = (lostFigures: Array<Figure>) => {
    let costInPawnWhite = 0
    let costInPawnBlack = 0

    lostFigures.forEach((lostFigure) => {
        if (lostFigure.color === Colors.WHITE) {
            costInPawnBlack += getCostFigure(lostFigure.name)
        } else {
            costInPawnWhite += getCostFigure(lostFigure.name)
        }
    })
    return costInPawnWhite - costInPawnBlack
}

/**
 * Gets the cost of a chess figure in pawns.
 *
 * @param {string} figureName - The name of the chess figure.
 * @returns {number} The cost of the chess figure in pawns.
 * @throws {Error} Throws an error if the figure name is not recognized.
 */
const getCostFigure = (figureName: string): number => {
    switch (figureName) {
        case 'Pawn':
            return 1
        case 'Knight':
        case 'Bishop':
            return 3
        case 'Rook':
            return 5
        case 'Queen':
            return 9
        default:
            throw new Error(
                "It wasn't a common name when trying to convert to pawns."
            )
    }
}

export default convertCapturedPiecesAdvantage
