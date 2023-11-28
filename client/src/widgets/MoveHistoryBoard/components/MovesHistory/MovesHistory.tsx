/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useState } from 'react'
import './style.scss'

interface MovesHistoryProps {
    historyMoves: Array<{
        engleashNotation: string
        algebraicNotation: string
        selectedFigureLogo: string | undefined | null
    }>
    handleChangeCurrentViewedMove: () => void
}

const MovesHistory: FC<MovesHistoryProps> = ({
    historyMoves,
    handleChangeCurrentViewedMove,
}) => {
    const [selectedMove, setSelectedMove] = useState<number | null>(null)
    return (
        <div className="history-moves">
            {historyMoves.map(
                (
                    notation: {
                        engleashNotation: string
                        selectedFigureLogo: string | undefined | null
                    },
                    index
                ) => {
                    console.log(notation)
                    if (index % 2 === 0) {
                        const containerNumber = index / 2 + 1
                        const isNextMove =
                            historyMoves.length > index + 1 ? true : false
                        return (
                            <div
                                className={[
                                    'moves-container',
                                    containerNumber % 2 === 0 && 'even-row',
                                ].join(' ')}
                                key={index}
                            >
                                <p className="row-number">{containerNumber}.</p>
                                <div className="container-notation__move">
                                    {notation.selectedFigureLogo && (
                                        <img
                                            className="notation-figure__logo"
                                            src={notation.selectedFigureLogo}
                                            alt="figure logo"
                                        />
                                    )}
                                    <p
                                        className="move even-move"
                                        onClick={() => setSelectedMove(index)}
                                    >
                                        {notation.engleashNotation}
                                    </p>
                                </div>
                                {isNextMove && (
                                    <div className="container-notation__move">
                                        {historyMoves[index + 1]
                                            .selectedFigureLogo && (
                                            <img
                                                className="notation-figure__logo"
                                                src={
                                                    historyMoves[index + 1]
                                                        .selectedFigureLogo!
                                                }
                                                alt="figure logo"
                                            />
                                        )}
                                        <p
                                            className="move odd-move"
                                            onClick={() =>
                                                setSelectedMove(index + 1)
                                            }
                                        >
                                            {
                                                historyMoves[index + 1]
                                                    .engleashNotation
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    }
                    return null
                }
            )}
        </div>
    )
}

export default MovesHistory
