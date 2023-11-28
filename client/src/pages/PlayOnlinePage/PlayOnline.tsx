/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import OnlineGameModel from '../../entites/OnlineGameModel'
import BoardComponent from '../../widgets/Board/BoardComponent'
import OpponentInfo from '../../widgets/OpponentInfo/OpponentInfo'
import StartGameBoard from '../../widgets/StartGameBoard/StartGameBoard'
import './style.scss'
import Board from '../../entites/board/Board'
import MoveHistoryBoard from '../../widgets/MoveHistoryBoard/MoveHistoryBoard'

const PlayOnline = () => {
    const [board, setBoard] = useState<Board>(new Board())
    const [gameStarted, setGameStarted] = useState(false)
    const onlineGameModel = useMemo(() => {
        return new OnlineGameModel(setBoard, board)
    }, [])

    useEffect(() => {
        setGameStarted(onlineGameModel.gameStarted)
    }, [onlineGameModel.gameStarted])

    useEffect(() => {
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        setBoard(newBoard)
    }, [])

    return (
        <div className="container-play__online">
            <OpponentInfo
                board={board}
                playerStatus="current"
                gameMode={onlineGameModel}
            />
            <BoardComponent
                board={board}
                setBoard={setBoard}
                gameMode={onlineGameModel}
            />
            <OpponentInfo
                board={board}
                playerStatus="opponent"
                gameMode={onlineGameModel}
            />
            {gameStarted ? (
                <MoveHistoryBoard board={board}/>
                ) : (
                <StartGameBoard onlineGameModel={onlineGameModel} />
            )}
        </div>
    )
}

export default PlayOnline
