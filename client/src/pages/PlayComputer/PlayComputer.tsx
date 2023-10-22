import UtilityBoardUI from '../../shared/UI/GameBoard/UtilityBoardUI'
import BoardComponent from '../../widgets/Board/BoardComponent'
import ComputerGameBoard from '../../widgets/ComputerGameBoard/ComputerGameBoard'
import './style.scss'

const PlayComputer = () => {
    return (
        <div className="container-play__computer">
            <BoardComponent/>
            <UtilityBoardUI>
                <ComputerGameBoard/>
                
            </UtilityBoardUI>
        </div>
    )
}

export default PlayComputer
