/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC } from 'react'
import './style.scss'
import { Colors } from '../../../../constants/Colors'
import blackKingLogo from '../../../../assets/black-king.png'
import whiteKingLogo from '../../../../assets/white-king.png'
import blackKnightLogo from '../../../../assets/black-knight.png'
import whiteKnightLogo from '../../../../assets/white-knight.png'
import blackBishopLogo from '../../../../assets/black-bishop.png'
import whiteBishopLogo from '../../../../assets/white-bishop.png'
import blackRookLogo from '../../../../assets/black-rook.png'
import whiteRookLogo from '../../../../assets/white-rook.png'
import blackQueenLogo from '../../../../assets/black-queen.png'
import whiteQueenLogo from '../../../../assets/white-queen.png'

interface MovesHistoryProps {
    historyMoves: Array<string>
    handleChangeCurrentViewedMove: (newCurrentViewedIndexMove: number) => void
    currentViewedIndexMove: number
}

const MovesHistory: FC<MovesHistoryProps> = ({
    historyMoves,
    handleChangeCurrentViewedMove,
    currentViewedIndexMove,
}) => {
    const getFigureLogo = (figureColor: Colors, firstLetter: string | null) => {
        const isWhiteColor = figureColor === Colors.WHITE
        if (firstLetter === 'O') return
        switch (firstLetter) {
            case 'N':
                return isWhiteColor ? whiteKnightLogo : blackKnightLogo
            case 'B':
                return isWhiteColor ? whiteBishopLogo : blackBishopLogo
            case 'R':
                return isWhiteColor ? whiteRookLogo : blackRookLogo
            case 'Q':
                return isWhiteColor ? whiteQueenLogo : blackQueenLogo
            case 'K':
                return isWhiteColor ? whiteKingLogo : blackKingLogo
                break
            default:
                return
        }
    }

    const getAlgebraicNotationWithEngleash = (
        engleashNotation: string
    ): string => {
        let resultAlgebraicNotation = ''
        if (engleashNotation === 'O-O-O' || engleashNotation === 'O-O') {
            return engleashNotation
        } else {
            const matchResult = engleashNotation.match(
                /^([A-Z]?)([a-h][1-8])(x?)([A-Z]?)([a-h][1-8])([=][A-Z])?([+])?$/
            )

            if (matchResult) {
                console.log(matchResult, 'fsdfnjsdnsdk')
                if (matchResult[3] && !matchResult[1])
                    resultAlgebraicNotation += matchResult[2][0]
                if (matchResult[3]) resultAlgebraicNotation += matchResult[3]

                resultAlgebraicNotation += matchResult[5]
                if (matchResult[6]) resultAlgebraicNotation += matchResult[6]
                if (matchResult[7]) resultAlgebraicNotation += matchResult[7]
                return resultAlgebraicNotation
            } else {
                return resultAlgebraicNotation
            }
        }
    }

    return (
        <div className="history-moves">
            {historyMoves.map((notation, index) => {
                if (index % 2 === 0) {
                    const containerNumber = index / 2 + 1
                    const isBlackMove = historyMoves.length > index + 1
                    const whiteMove = getAlgebraicNotationWithEngleash(notation)
                    const blackMove = isBlackMove
                        ? getAlgebraicNotationWithEngleash(
                              historyMoves[index + 1]
                          )
                        : ''
                    const whiteFigureLogo = getFigureLogo(
                        Colors.BLACK,
                        notation[0]
                    )

                    const blackFigureLogo = isBlackMove
                        ? getFigureLogo(
                              Colors.BLACK,
                              historyMoves[index + 1][0]
                          )
                        : ''
                    return (
                        <div
                            className={[
                                'moves-container',
                                containerNumber % 2 === 0 && 'even-row',
                            ].join(' ')}
                            key={index}
                        >
                            <p className="row-number">{containerNumber}.</p>
                            <div
                                onClick={() => {
                                    handleChangeCurrentViewedMove(index)
                                }}
                                className={[
                                    'container-notation__move',
                                    'white-notation__move',
                                    currentViewedIndexMove === index &&
                                        'selected-move__index',
                                ].join(' ')}
                            >
                                {whiteMove && (
                                    <>
                                        {whiteFigureLogo && (
                                            <img
                                                className="notation-figure__logo"
                                                src={whiteFigureLogo}
                                                alt="figure logo"
                                            />
                                        )}

                                        <p className="move even-move">
                                            {notation.includes('O-O' || 'O-O-O')
                                                ? notation
                                                : whiteMove}
                                        </p>
                                    </>
                                )}
                            </div>
                            {isBlackMove && (
                                <div
                                    onClick={() => {
                                        handleChangeCurrentViewedMove(index + 1)
                                    }}
                                    className={[
                                        'container-notation__move',
                                        'black-notation__move',
                                        currentViewedIndexMove === index + 1 &&
                                            'selected-move__index',
                                    ].join(' ')}
                                >
                                    {isBlackMove && (
                                        <>
                                            {blackFigureLogo && (
                                                <img
                                                    className="notation-figure__logo"
                                                    src={blackFigureLogo!}
                                                    alt="figure logo"
                                                />
                                            )}
                                            <p className="move even-move">
                                                {historyMoves[
                                                    index + 1
                                                ].includes('O-O')
                                                    ? historyMoves[index + 1]
                                                    : blackMove}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                }
                return null
            })}
        </div>
    )
}

export default MovesHistory
