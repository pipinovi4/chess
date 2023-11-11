import { FC, useEffect, useState } from 'react'
import './style.scss'
import ModalLeftBar from './ModalLeftBar'
import DefaultLeftBar from './DefaultLeftBar'

interface LeftBarProps {
    isActiveLogin: boolean
    isActiveRegistration: boolean
    setIsActiveLogin: (isActiveLogin: boolean) => void
    setIsActiveRegistration: (isActiveRegistration: boolean) => void
}

const LeftBar: FC<LeftBarProps> = ({isActiveLogin, isActiveRegistration, setIsActiveLogin, setIsActiveRegistration}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            // Проверяем размеры окна браузера
            if (window.innerWidth < 1028 && window.innerHeight < 500) {
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
        <div className="left-bar__container">
            {isModalOpen ? (
                <ModalLeftBar
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    {/* Содержимое модального окна */}
                    <h2>Модальное окно</h2>
                    <p>Это ваше модальное окно с содержимым.</p>
                </ModalLeftBar>
            ) : (
                <DefaultLeftBar isActiveLogin={isActiveLogin} isActiveRegistration={isActiveRegistration} setIsActiveLogin={setIsActiveLogin} setIsActiveRegistration={setIsActiveRegistration}/>
            )}
        </div>
    )
}

export default LeftBar
