import { FC, useState } from 'react'
import pawn from '../../widgets/AuthModals/assets/whitePawnLogo.svg'
import rook from '../../widgets/AuthModals/assets/whiteRookLogo.svg'
import queen from '../../widgets/AuthModals/assets/whiteQueenLogo.svg'
import './style.scss'
import EngineModel from '../../entites/EngineModel'

interface ComputerBoardProps {
    engineModel: EngineModel
}

const ComputerGameBoard: FC<ComputerBoardProps> = ({engineModel}) => {
    const [difficultyBot, setDifficultyBot] = useState<string>('')

    const handleStartEngine = async () => {
        await engineModel.prepareAndStartEngine()
    }

    return (
        <div className="container-computer__board">
            <h2 className="computer-board__title">Play vs...</h2>
            <div className="container-cards__bots">
                <div
                    onClick={() => setDifficultyBot('begginer')}
                    className={[
                        'bot-card__begginer',
                        'card-bot',
                        difficultyBot === 'begginer' && 'active',
                    ].join(' ')}
                >
                    <img className="bot-image" src={pawn} alt="" />
                    <p className="bot-name">Begginer</p>
                </div>
                <div
                    onClick={() => setDifficultyBot('amateur')}
                    className={[
                        'bot-card__amateur',
                        'card-bot',
                        difficultyBot === 'amateur' && 'active',
                    ].join(' ')}
                >
                    <img className="bot-image" src={rook} alt="" />
                    <p className="bot-name">Amateur</p>
                </div>
                <div
                    onClick={() => setDifficultyBot('proffesional')}
                    className={[
                        'bot-card__professional',
                        'card-bot',
                        difficultyBot === 'proffesional' && 'active',
                    ].join(' ')}
                >
                    <img className="bot-image" src={queen} alt="" />
                    <p className="bot-name">Proffesional</p>
                </div>
            </div>
            <div className="footer-computer__board">
                <button onClick={async() => await handleStartEngine()} className="button-choose__bot">Choose</button>
            </div>
        </div>
    )
}

export default ComputerGameBoard
