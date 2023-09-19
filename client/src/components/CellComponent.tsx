import React, { FC } from 'react'
import { Cell } from '../models/Cell'
import '../styles/cell.scss'
import { Colors } from '../models/Colors'
import { FigureNames } from '../figures/Figure'
import ModalPickFigure from './ModalPickFigure'

interface CellProps {
    cell: Cell
    click: (cell: Cell) => void
    selected: boolean
    activeModal: boolean
    setActiveModal: (activeModal: boolean) => void
}

const CellComponent: FC<CellProps> = ({ cell, click, selected, activeModal, setActiveModal }) => {
    const kingAttacked =
    cell.underAtack.includes(cell.figure?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE) &&
    cell.figure &&
    cell.figure?.name === FigureNames.KING
        ? 'king-attacked'
        : ''
    return (
        <div
            className={['cell', cell.color, selected ? 'selected' : '', kingAttacked].join(
                ' '
            )}
            onClick={() => click(cell)}
        >   
            {cell.x};{cell.y}
            {cell.available && !cell.figure && <div className={'available'} />}
            {activeModal && cell.figure?.name === FigureNames.PAWN && cell.y === 0 && cell  && <ModalPickFigure activeModal={activeModal} cell={cell} setActiveModal={setActiveModal}/>}
            <div
                className={[
                    cell.available && cell.figure ? 'figure-threatened' : '',
                ].join(' ')}
            ></div>
            {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
        </div>
    )
}

export default CellComponent
