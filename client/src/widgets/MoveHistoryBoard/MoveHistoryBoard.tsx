import { FC, useEffect, useState } from 'react'
import './style.scss'
import Board from '../../entites/board/Board'
import MovesHistory from './components/MovesHistory/MovesHistory'
import ControllersHistoryMoves from './components/ControllersHistoryMoves/ControllersHistoryMoves'
import convertAlgebraicNotation from '../../helpers/convertersNotation/convertAlgebraicNotation'

interface MoveHistoryBoardProps {
    board: Board
}

const MoveHistoryBoard: FC<MoveHistoryBoardProps> = ({ board }) => {
    const [historyMoves, setHistoryMoves] = useState<
        Array<{
            engleashNotation: string
            algebraicNotation: string
            selectedFigureLogo: string | undefined | null
        }>
    >([])
    const [currentViewedIndexMove, setCurrentViewedIndexMove] =
        useState<number>(historyMoves.length - 1)

    useEffect(() => {
        setHistoryMoves(board.historyMoves)
    }, [board.historyMoves])

    const handleChangeCurrentViewedMove = () => {
        for (
            let i = historyMoves.length;
            i !== currentViewedIndexMove;
            i > currentViewedIndexMove ? i-- : i++
        ) {
            const previousAlgebraicNotationMove =
                historyMoves[i].algebraicNotation
            const cordinatesCells = convertAlgebraicNotation(
                previousAlgebraicNotationMove
            )
            if (
                cordinatesCells?.targetCell.x &&
                cordinatesCells.targetCell.y &&
                cordinatesCells?.selectedCell.x &&
                cordinatesCells.selectedCell.y
            ) {
                const targetCell = board.getCell(
                    cordinatesCells?.targetCell.x,
                    cordinatesCells?.targetCell.y
                )
                const selectedCell = board.getCell(
                    cordinatesCells?.selectedCell.x,
                    cordinatesCells?.selectedCell.y
                )

                selectedCell.figure = targetCell.figure
                targetCell.figure =
                    board.lostFigures[board.lostFigures.length - 1]
            }
        }
    }

    return (
        <div className="container-moves__history">
            <MovesHistory
                handleChangeCurrentViewedMove={handleChangeCurrentViewedMove}
                historyMoves={historyMoves}
            />
            <ControllersHistoryMoves
                setCurrentViewedIndexMove={setCurrentViewedIndexMove}
                handleChangeCurrentViewedMove={handleChangeCurrentViewedMove}
            />
        </div>
    )
}

export default MoveHistoryBoard

