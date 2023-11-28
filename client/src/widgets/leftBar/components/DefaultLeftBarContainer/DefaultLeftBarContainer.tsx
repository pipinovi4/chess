import { FC } from 'react'
import LeftbarContent from '../LeftbarContent/LeftbarContent'
import './style.scss'

interface DefaultLeftBarContainerProps {
    isActiveLogin: boolean
    isActiveRegistration: boolean
    setIsActiveLogin: (isActiveLogin: boolean) => void
    setIsActiveRegistration: (isActiveRegistration: boolean) => void
}

const DefaultLeftBarContainer: FC<DefaultLeftBarContainerProps> = ({
    isActiveLogin,
    isActiveRegistration,
    setIsActiveLogin,
    setIsActiveRegistration,
}) => {
    return (
        <div className="left-bar__container">
            <LeftbarContent
                isActiveLogin={isActiveLogin}
                isActiveRegistration={isActiveRegistration}
                setIsActiveLogin={setIsActiveLogin}
                setIsActiveRegistration={setIsActiveRegistration}
            />
        </div>
    )
}

export default DefaultLeftBarContainer
