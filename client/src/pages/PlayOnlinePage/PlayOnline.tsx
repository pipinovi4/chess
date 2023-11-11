import { useState } from 'react'
import OnlineGameModel from '../../entites/OnlineGameModel'
import Board from '../../entites/board/Board'
import BoardComponent from '../../widgets/Board/BoardComponent'
import OpponentInfo from '../../widgets/OpponentInfo/OpponentInfo'
import StartGameBoard from '../../widgets/StartGameBoard/StartGameBoard'
import Timer from '../../widgets/Timer/Timer'
import './playOnline.scss'

const PlayOnline = () => {
    const [gameBoard, setGameBoard] = useState<Board | null>(null)
    const onlineGameModel = new OnlineGameModel()

    const players = onlineGameModel.getPlayers()
    return (
        <div className="container-play__online">
            <OpponentInfo
                gameBoard={gameBoard}
                player={players?.currentPlayer}
            />
            <Timer
                currentPlayer={players?.currentPlayer}
                onlineGameModel={onlineGameModel}
            />
            <BoardComponent
                setGameBoard={setGameBoard}
                gameMode={onlineGameModel}
            />
            {players?.currentPlayer && players?.opponentPlayer ? (
                <>mama</>
            ) : (
                <StartGameBoard onlineGameModel={onlineGameModel} />
            )}
            <OpponentInfo player={players?.opponentPlayer} gameBoard={gameBoard} />
            <Timer
                currentPlayer={players?.opponentPlayer}
                onlineGameModel={onlineGameModel}
            />
        </div>
    )
}

export default PlayOnline
