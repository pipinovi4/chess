import React, { FC, useState } from 'react'
import './style.scss'
import LeftbarContent from '../LeftbarContent/LeftbarContent'

interface ModalLeftBarContainerProps {
    isActiveLogin: boolean
    isActiveRegistration: boolean
    setIsActiveLogin: (isActiveLogin: boolean) => void
    setIsActiveRegistration: (isActiveRegistration: boolean) => void
}

const ModalLeftBarContainer: FC<ModalLeftBarContainerProps> = ({
    isActiveLogin,
    isActiveRegistration,
    setIsActiveLogin,
    setIsActiveRegistration,
}) => {
    const [isActiveModal, setIsActiveModal] = useState<boolean>(false)

    const handleClose = () => {
        setIsActiveModal(false)
    }

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <>
            {!isActiveModal ? (
                <div
                    className={`hamburger ${isActiveModal ? 'active' : ''}`}
                    onClick={() => setIsActiveModal(true)}
                >
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            ) : (
                <div className="modal-leftBar__container" onClick={handleClose}>
                    <div className="modal-content" onClick={handleContentClick}>
                        <button className="close-button" onClick={handleClose}>
                            &times;
                        </button>
                        <LeftbarContent
                            isActiveLogin={isActiveLogin}
                            isActiveRegistration={isActiveRegistration}
                            setIsActiveLogin={setIsActiveLogin}
                            setIsActiveRegistration={setIsActiveRegistration}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalLeftBarContainer
