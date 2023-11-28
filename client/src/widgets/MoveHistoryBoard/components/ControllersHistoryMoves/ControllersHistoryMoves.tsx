import { useNavigate } from 'react-router-dom'
import arrow from '../../../../assets/arrow.svg'
import plus from '../../../../assets/plus.svg'
import './style.scss'
import { FC } from 'react'

interface ControllersHistoryMovesProps {
    handleChangeCurrentViewedMove: () => void
    setCurrentViewedIndexMove:  React.Dispatch<React.SetStateAction<number>>
}

const ControllersHistoryMoves: FC<ControllersHistoryMovesProps> = ({
    handleChangeCurrentViewedMove,
    setCurrentViewedIndexMove
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
            <button data-tooltip="Move Back" className="backward-move__button">
                <img
                    onClick={() => {
                        setCurrentViewedIndexMove((prev: number) => prev - 1)
                        handleChangeCurrentViewedMove
                    }}
                    className="backward-image__arrow"
                    src={arrow}
                    alt="arrow"
                />
            </button>
            <button
                onClick={handleChangeCurrentViewedMove}
                data-tooltip="Move Forward"
                className="forward-move__button"
            >
                <img className="forward-image__arrow" src={arrow} alt="arrow" />
            </button>
        </div>
    )
}

export default ControllersHistoryMoves
