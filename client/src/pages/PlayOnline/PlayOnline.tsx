import BoardComponent from '../../widgets/Board/BoardComponent'
import StartGameBoard from '../../widgets/StartGameBoard/StartGameBoard'
import './playOnline.scss'

const PlayOnline = () => {
    return (
        <div className='container-play__online'>
            <BoardComponent />
            <StartGameBoard/>
        </div>
    )
}

export default PlayOnline
