/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, RefObject, useEffect, useRef } from 'react'
import { Cell } from '../../entites/cell/Cell'
import './style.scss'
import { Colors } from '../../constants/Colors'
import { FigureNames } from '../../entites/figures/Figure'
import ModalPickFigure from '../ModalPickFigure'
import moveFigureDragging from '../../models/moveFigure/moveFigureDragging'

interface CellProps {
    cell: Cell
    activeModal: boolean
    setActiveModal: (activeModal: boolean) => void
    boardRef: RefObject<HTMLDivElement>
    selectedCell: Cell | null
    handleMoveFigure: (cell: Cell) => void
    setSelectedCell: (selectedCell: Cell) => void
}

const CellComponent: FC<CellProps> = ({
    cell,
    activeModal,
    setActiveModal,
    boardRef,
    handleMoveFigure,
    selectedCell,
    setSelectedCell,
}) => {
    const figureRef = useRef<HTMLImageElement | null>(null)
    const cellRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            moveFigureDragging.handleMouseMove(cellRef, boardRef, event);
        };
    
        const handleMouseUp = (event: MouseEvent) => {
            moveFigureDragging.handleMouseUp();
            const cords = moveFigureDragging.detectedTargetCell(cellRef, cell, event);
            if (cords) {
                setSelectedCell(cell);
                handleMoveFigure(cords);
            }
        };
    
        if (moveFigureDragging.isMouseDown && moveFigureDragging.currentCell === cell) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [moveFigureDragging.isMouseDown]);    

    const kingAttacked =
        cell.underAtack.includes(
            cell.figure?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        ) &&
        cell.figure &&
        cell.figure?.name === FigureNames.KING
            ? 'king-attacked'
            : ''

    return (
        <div
            onMouseDown={(event: React.MouseEvent) => {
                moveFigureDragging.setCurrentCell(cell)
                handleMoveFigure(cell)
                moveFigureDragging.setFigureRef(figureRef)
                moveFigureDragging.handleMouseDown(event)
            }}
            onClick={() => handleMoveFigure(cell)}
            className={[
                'cell',
                cell.color,
                selectedCell === cell && cell.figure ? 'selected' : '',
                kingAttacked,
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
                    cell.available && cell.figure ? 'figure-threatened' : ''
                }
            ></div>
            {cell.figure?.logo && (
                <img
                    style={{ position: 'absolute', zIndex: '9999' }}
                    ref={figureRef}
                    src={cell.figure.logo}
                    alt=""
                />
            )}
        </div>
    )
}

export default CellComponent
