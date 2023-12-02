/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import EngineModel from '../../entites/EngineModel'
import Board from '../../entites/board/Board'
import BoardComponent from '../../widgets/Board/BoardComponent'
import ComputerGameBoard from '../../widgets/ComputerGameBoard/ComputerGameBoard'
import OpponentInfo from '../../widgets/OpponentInfo/OpponentInfo'
import PawnAdvantageColumn from '../../widgets/PawnAdvantageColumn/PawnAdvantageColumn'
import './style.scss'
import MoveHistoryBoard from '../../widgets/MoveHistoryBoard/MoveHistoryBoard'

const PlayComputer = () => {
    const [board, setBoard] = useState<Board>(new Board())
    const [gameStarted, setGameStarted] = useState(false)
    const [nowCanMakeMove, setNowCanMakeMove] = useState(true)

    const engineModel = useMemo(() => {
        return new EngineModel(setBoard, board)
    }, [])

    useEffect(() => {
        setGameStarted(engineModel.gameStarted)
    }, [engineModel.gameStarted])

    useEffect(() => {
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        setBoard(newBoard)
    }, [])

    return (
        <div className="container-play__computer">
            <PawnAdvantageColumn engineModel={engineModel} />
            <OpponentInfo
                board={board}
                playerStatus="current"
                gameMode={engineModel}
            />
            <BoardComponent
                nowCanMakeMove={nowCanMakeMove}
                board={board}
                setBoard={setBoard}
                gameMode={engineModel}
            />
            <OpponentInfo
                board={board}
                playerStatus="opponent"
                gameMode={engineModel}
            />
            {gameStarted ? (
                <MoveHistoryBoard board={board} setBoard={setBoard} />
            ) : (
                <ComputerGameBoard engineModel={engineModel} />
            )}
        </div>
    )
}

export default PlayComputer
