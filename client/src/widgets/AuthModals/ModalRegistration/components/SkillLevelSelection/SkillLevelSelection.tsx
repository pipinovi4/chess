import React, { useState } from 'react'
import pawn from '../../../assets/whitePawnLogo.svg'
import rook from '../../../assets/whiteRookLogo.svg'
import queen from '../../../assets/whiteQueenLogo.svg'
import knight from '../../../assets/whiteKnightLogo.svg'
import './skillLevelSelection.scss'

enum SkillLevel {
    Pawn = 'pawn',
    Knight = 'knight',
    Rook = 'rook',
    Queen = 'queen',
}

const SkillLevelSelection = () => {
    const [activeCard, setActiveCard] = useState<SkillLevel | null>(null)

    const handleCardClick = (cardName: SkillLevel) => {
        setActiveCard(activeCard === cardName ? null : cardName)
        console.log(cardName)
    }

    return (
        <div className="skill-level__selection">
            <p className="skill-question">What is your chess skill level?</p>
            <div className="cards-level">
                <div
                    className={`new-skill__card card-skill ${
                        activeCard === SkillLevel.Pawn ? 'active' : ''
                    }`}
                    onClick={() => handleCardClick(SkillLevel.Pawn)}
                >
                    <div
                        className={`selected-card ${
                            activeCard === SkillLevel.Pawn ? 'active' : ''
                        }`}
                    ></div>
                    <img className="skill-level__image" src={pawn} alt="pawn" />
                    <p className="level-name">New to Chess</p>
                </div>
                <div
                    className={`beginner-skill__card card-skill ${
                        activeCard === SkillLevel.Knight ? 'active' : ''
                    }`}
                    onClick={() => handleCardClick(SkillLevel.Knight)}
                >
                    <div
                        className={`selected-card ${
                            activeCard === SkillLevel.Knight ? 'active' : ''
                        }`}
                    ></div>
                    <img
                        className="skill-level__image"
                        src={knight}
                        alt="knight"
                    />
                    <p className="level-name">Beginner</p>
                </div>
                <div
                    className={`intermediate-skill__card card-skill ${
                        activeCard === SkillLevel.Rook ? 'active' : ''
                    }`}
                    onClick={() => handleCardClick(SkillLevel.Rook)}
                >
                    <div
                        className={`selected-card ${
                            activeCard === SkillLevel.Rook ? 'active' : ''
                        }`}
                    ></div>
                    <img className="skill-level__image" src={rook} alt="rook" />
                    <p className="level-name">Intermediate</p>
                </div>
                <div
                    className={`advanced-skill__card card-skill ${
                        activeCard === SkillLevel.Queen ? 'active' : ''
                    }`}
                    onClick={() => handleCardClick(SkillLevel.Queen)}
                >
                    <div
                        className={`selected-card ${
                            activeCard === SkillLevel.Queen ? 'active' : ''
                        }`}
                    ></div>
                    <img
                        className="skill-level__image"
                        src={queen}
                        alt="queen"
                    />
                    <p className="level-name">Advanced</p>
                </div>
            </div>
        </div>
    )
}

export default SkillLevelSelection
