import React from 'react'
import './style.scss'
import pawnOnBoard from '../../assets/board.png'
import { useNavigate } from 'react-router-dom'

const HomeContent = () => {
    const navigate = useNavigate()

    const handleNavigate = (namePage: string) => {
        navigate(namePage)
    }
    return (
        <div className="home-content__container">
            <div className="main-container">
                <div className="image-container">
                    <img className="main-image" src={pawnOnBoard} alt="" />
                </div>
                <div className="content-container">
                    <div className="title-content__container">
                        <h1 className='title'>Play Chess</h1>
                        <h1 className='title'>Online</h1>
                        <h1 className='title'>on the #1 Site!</h1>
                    </div>
                    <div className="text-content__container">
                        <div className="container-games__today">
                        <h3 className='text text-games__today'>333 Games Today</h3>
                        </div>
                        <div className="container-games__now">
                        <h3 className='text text-games__now'>12 Playing Now</h3>

                        </div>
                    </div>
                    <div className="game-button__container">
                        <button onClick={() => handleNavigate('/play/online')} className='button-online__game'>Play Online</button>
                        <button onClick={() => handleNavigate('/play/computer')} className='button-computer__game'>Play Computer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeContent
