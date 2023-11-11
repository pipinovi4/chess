import './style.scss'
import UtilityBoardComponent from '../../widgets/GameModeSelector/GameModeSelector'
import board from '../../assets/board-fs8.png'

const PlayPage = () => {
    return (
        <div className="container-play__page">
            <img src={board} alt="" className='play-image__board' />
            <UtilityBoardComponent />
        </div>
    )
}

export default PlayPage
