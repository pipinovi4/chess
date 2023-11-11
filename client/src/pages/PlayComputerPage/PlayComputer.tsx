import { useState } from 'react'
import EngineModel from '../../entites/EngineModel'
import UtilityBoardUI from '../../shared/UI/GameBoard/UtilityBoardUI'
import BoardComponent from '../../widgets/Board/BoardComponent'
import ComputerGameBoard from '../../widgets/ComputerGameBoard/ComputerGameBoard'
import OpponentInfo from '../../widgets/OpponentInfo/OpponentInfo'
import PawnAdvantageColumn from '../../widgets/PawnAdvantageColumn/PawnAdvantageColumn'
import './style.scss'
import Board from '../../entites/board/Board'

const PlayComputer = () => {
    const engineModel = new EngineModel()
    const [gameBoard, setGameBoard] = useState<Board | null>(null)
    return (
        <div className="container-play__computer">
            <PawnAdvantageColumn engineModel={engineModel} />
            <OpponentInfo player={engineModel.getPlayers()?.opponentPlayer} gameBoard={gameBoard} engineModel={engineModel} />
            <BoardComponent setGameBoard={setGameBoard} gameMode={engineModel} />
            <OpponentInfo player={engineModel.getPlayers()?.currentPlayer} gameBoard={gameBoard} />
            <UtilityBoardUI>
                <ComputerGameBoard engineModel={engineModel} />
            </UtilityBoardUI>
        </div>
    )
}

export default PlayComputer
