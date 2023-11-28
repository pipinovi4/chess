import './style.scss'
import GameModeSelector from '../../widgets/GameModeSelector/GameModeSelector'
import board from '../../assets/board.png'

const PlayPage = () => {
    return (
        <div className="container-play__page">
            <img src={board} alt="" className='play-image__board' />
            <GameModeSelector />
        </div>
    )
}

export default PlayPage
