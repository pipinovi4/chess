import BoardComponent from '../../widgets/Board/BoardComponent'
import './style.scss'
import UtilityBoardComponent from '../../widgets/GameModeSelector/GameModeSelector'

const PlayPage = () => {
    return (
        <div className="container-play__page">
            <BoardComponent />
            <UtilityBoardComponent />
        </div>
    )
}

export default PlayPage
