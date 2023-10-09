import React, { FC, ReactNode } from 'react';

interface ModalLeftBarProps {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode; // Добавляем children в интерфейс
}

const ModalLeftBar: FC<ModalLeftBarProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null; // Не отображаем компонент, если isOpen равен false
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                {children} {/* Отображаем переданный контент */}
            </div>
        </div>
    );
};

export default ModalLeftBar;
