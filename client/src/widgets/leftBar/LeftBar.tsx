import { FC, useEffect, useState } from 'react'
import ModalLeftBar from './components/ModalLeftBarContainer/ModalLeftBarContainer'
import DefaultLeftBarContainer from './components/DefaultLeftBarContainer/DefaultLeftBarContainer'

interface LeftBarProps {
    isActiveLogin: boolean
    isActiveRegistration: boolean
    setIsActiveLogin: (isActiveLogin: boolean) => void
    setIsActiveRegistration: (isActiveRegistration: boolean) => void
}

const LeftBar: FC<LeftBarProps> = ({
    isActiveLogin,
    isActiveRegistration,
    setIsActiveLogin,
    setIsActiveRegistration,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 900) {
                setIsModalOpen(true)
            } else {
                setIsModalOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)

        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <>
            {isModalOpen ? (
                <ModalLeftBar
                    isActiveLogin={isActiveLogin}
                    isActiveRegistration={isActiveRegistration}
                    setIsActiveLogin={setIsActiveLogin}
                    setIsActiveRegistration={setIsActiveRegistration}
                />
            ) : (
                <DefaultLeftBarContainer
                    isActiveLogin={isActiveLogin}
                    isActiveRegistration={isActiveRegistration}
                    setIsActiveLogin={setIsActiveLogin}
                    setIsActiveRegistration={setIsActiveRegistration}
                />
            )}
        </>
    )
}

export default LeftBar
