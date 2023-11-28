/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, RefObject, useRef } from 'react'
import { Cell } from '../../entites/cell/Cell'
import './style.scss'
import { FigureNames } from '../../entites/figures/Figure'
import ModalPickFigure from '../ModalPickFigure'
import moveFigureService from '../../services/moveServices/moveFigureService'
import { Colors } from '../../constants/Colors'
import createChessNotation from '../../helpers/creatersNotation/createChessNotation'

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
    const cellChessNotation = createChessNotation(cell)
    const handleMouseDown = (event: React.MouseEvent) => {
        if (!selectedCell?.figure?.canMove(cell)) {
            moveFigureService.handleMouseDown(
                event,
                figureRef,
                cellRef,
                boardRef
            )
        }
        moveFigure(cell)
    }

    return (
        <div
            onMouseDown={handleMouseDown}
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
            <div
                className={[
                    'chess-notation__letter',
                    cell.x % 2
                        ? 'chess-notation__black'
                        : 'chess-notation__white',
                ].join(' ')}
            >
                {cell.y === 7 && cellChessNotation[0]}
            </div>
            <div
                className={[
                    'chess-notation__number',
                    cell.y % 2
                        ? 'chess-notation__white'
                        : 'chess-notation__black',
                ].join(' ')}
            >
                {cell.x === 0 && cellChessNotation[1]}
            </div>
            {cell.available && !cell.figure && <div className="available" />}
            {cell.underAtack.includes(
                cell.figure?.color === Colors.BLACK
                    ? Colors.WHITE
                    : Colors.BLACK
            ) && <div className="king-attacked" />}
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
                    selectedCell?.figure?.canMove(cell) && cell.figure
                        ? 'figure-threatened'
                        : ''
                }
            ></div>
            {cell.figure?.logo && (
                <img
                    id={cell.figure.id}
                    ref={figureRef}
                    src={cell.figure.logo}
                    alt=""
                />
            )}
        </div>
    )
}

export default CellComponent
