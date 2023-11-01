/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, RefObject, useRef } from 'react'
import { Cell } from '../../entites/cell/Cell'
import './style.scss'
import { FigureNames } from '../../entites/figures/Figure'
import ModalPickFigure from '../ModalPickFigure'
import moveFigureService from '../../services/moveServices/moveFigureService'
import { Colors } from '../../constants/Colors'

interface CellProps {
    cell: Cell
    activeModal: boolean
    setActiveModal: (activeModal: boolean) => void
    boardRef: RefObject<HTMLDivElement>
    selectedCell: Cell | null
    moveFigure: (cell: Cell) => void
}

const CellComponent: FC<CellProps> = ({
    cell,
    activeModal,
    setActiveModal,
    selectedCell,
    moveFigure,
    boardRef,
}) => {
    const figureRef = useRef<HTMLImageElement | null>(null)
    const cellRef = useRef<HTMLDivElement | null>(null)

    return (
        <div
            onMouseDown={(event: React.MouseEvent) => {
                moveFigure(cell)
                moveFigureService.handleMouseDown(
                    event,
                    figureRef,
                    cellRef,
                    boardRef
                )
            }}
            className={[
                'cell',
                selectedCell === cell && cell.figure ? 'selected' : '',
                cell.figure?.name === FigureNames.KING &&
                cell.underAtack.includes(
                    cell.figure.color === Colors.BLACK
                        ? Colors.WHITE
                        : Colors.BLACK
                )
                    ? 'king-attacked'
                    : '',
            ].join(' ')}
            ref={cellRef}
        >
            {cell.available && !cell.figure && <div className="available" />}
            {activeModal &&
                cell.figure?.name === FigureNames.PAWN &&
                cell.y === 0 &&
                cell && (
                    <ModalPickFigure
                        activeModal={activeModal}
                        cell={cell}
                        setActiveModal={setActiveModal}
                    />
                )}
            <div
                className={
                    cell.available && cell.figure  ? 'figure-threatened' : ''
                }
            ></div>
            {cell.figure?.logo && (
                <img ref={figureRef} src={cell.figure.logo} alt="" />
            )}
        </div>
    )
}

export default CellComponent
