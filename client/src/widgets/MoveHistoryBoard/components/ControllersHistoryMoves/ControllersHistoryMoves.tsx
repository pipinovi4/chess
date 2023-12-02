import { useNavigate } from 'react-router-dom'
import arrow from '../../../../assets/arrow.svg'
import plus from '../../../../assets/plus.svg'
import './style.scss'
import { FC } from 'react'

interface ControllersHistoryMovesProps {
    handleChangeCurrentViewedMove: (newCurrentViewedIndexMove: number) => void
    historyMoves: Array<string>
    currentViewedIndexMove: number
}

const ControllersHistoryMoves: FC<ControllersHistoryMovesProps> = ({
    handleChangeCurrentViewedMove,
    currentViewedIndexMove,
    historyMoves,
}) => {
    const navigate = useNavigate()
    return (
        <div className="controllers-history__moves">
            <button
                data-tooltip="New Game"
                className="end-game__button"
                onClick={() =>
                    navigate('/play', {
                        replace: true,
                        preventScrollReset: true,
                    })
                }
            >
                <img className="endGame-image__plus" src={plus} alt="plus" />
            </button>
            <button
                onClick={() => {
                    if (currentViewedIndexMove >= 0)
                        handleChangeCurrentViewedMove(
                            currentViewedIndexMove - 1
                        )
                }}
                data-tooltip="Move Back"
                className="backward-move__button"
            >
                <img
                    className="backward-image__arrow"
                    src={arrow}
                    alt="arrow"
                />
            </button>
            <button
                onClick={() => {
                    if (currentViewedIndexMove + 1 < historyMoves.length)
                        handleChangeCurrentViewedMove(
                            currentViewedIndexMove + 1
                        )
                }}
                data-tooltip="Move Forward"
                className="forward-move__button"
            >
                <img className="forward-image__arrow" src={arrow} alt="arrow" />
            </button>
        </div>
    )
}

export default ControllersHistoryMoves
