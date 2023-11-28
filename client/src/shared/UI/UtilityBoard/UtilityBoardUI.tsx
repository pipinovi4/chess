import React, { FC } from 'react'
import './style.scss'

interface UtilityBoardUIProps {
    children: React.ReactNode
}

const UtilityBoardUI: FC<UtilityBoardUIProps> = ({ children }) => {
    return (
        <div className='container'>
            <div className="game-board__component">
                <div className="semicircle" />
                {children}
            </div>
        </div>
    )
}

export default UtilityBoardUI
