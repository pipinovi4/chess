import { FC } from 'react'
import { Cell } from '../models/Cell'
import whiteQueen from '../assets/white-queen.png'
import blackQueen from '../assets/black-queen.png'
import whiteRook from '../assets/white-rook.png'
import blackRook from '../assets/black-rook.png'
import whiteBishop from '../assets/white-bishop.png'
import blackBishop from '../assets/black-bishop.png'
import whiteKngiht from '../assets/white-knight.png'
import blackKnight from '../assets/black-knight.png'
import { Colors } from '../models/Colors'
import { Queen } from '../figures/Queen'
import { Figure } from '../figures/Figure'
import { Knight } from '../figures/Knigt'
import { Rook } from '../figures/Rook'
import { Bishop } from '../figures/Bishop'
import '../styles/modal.scss'

interface ModalPickFigureProps {
    activeModal: boolean
    setActiveModal: (activeModal: boolean) => void
    cell: Cell
}

const ModalPickFigure: FC<ModalPickFigureProps> = ({
    setActiveModal,
    cell,
    activeModal,
}) => {

    const handleFigureSelect = (figure:  Figure) => {
        setActiveModal(!activeModal)
        cell.figure = null
        cell.figure = figure
    }

    const cancelingPawnPromotion = () => {
        setActiveModal(!activeModal)
    }

    return (
        <div className={`modal ${activeModal ? 'open' : 'closed'}`}>
            <div className="modal-content">
                <img src={cell.figure?.color === Colors.WHITE ? whiteQueen : blackQueen} alt="queen" onClick={() => handleFigureSelect(new Queen(cell.figure?.color, cell))} />
                <img src={cell.figure?.color === Colors.WHITE ? whiteKngiht : blackKnight} alt="knight" onClick={() => handleFigureSelect(new Knight(cell.figure?.color, cell))} />
                <img src={cell.figure?.color === Colors.WHITE ? whiteRook : blackRook} alt="rook" onClick={() => handleFigureSelect(new Rook(cell.figure?.color, cell))} />
                <img src={cell.figure?.color === Colors.WHITE ? whiteBishop : blackBishop} alt="bishop" onClick={() => handleFigureSelect(new Bishop(cell.figure?.color, cell))} />
            </div>
            <h2 onClick={() => setActiveModal(!activeModal)}>close</h2>
        </div>
    )
}

export default ModalPickFigure
