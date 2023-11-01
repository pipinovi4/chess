import EngineModel from '../../entites/EngineModel'
import UtilityBoardUI from '../../shared/UI/GameBoard/UtilityBoardUI'
import BoardComponent from '../../widgets/Board/BoardComponent'
import ComputerGameBoard from '../../widgets/ComputerGameBoard/ComputerGameBoard'
import './style.scss'

const PlayComputer = () => {
    const engineModel = new EngineModel()
    return (
        <div className="container-play__computer">
            <BoardComponent engineModel={engineModel} />
            <UtilityBoardUI>
                <ComputerGameBoard engineModel={engineModel} />
            </UtilityBoardUI>
        </div>
    )
}

export default PlayComputer
