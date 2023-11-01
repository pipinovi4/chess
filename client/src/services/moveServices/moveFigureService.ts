/* eslint-disable no-dupe-else-if */
import { RefObject } from 'react'
import { Cell } from '../../entites/cell/Cell'

type coordinates = { x: number; y: number }

class moveFigureService {
    public positionFigure: coordinates
    public startPositionMouse: coordinates
    public isMouseDown: boolean
    public figureRef: RefObject<HTMLImageElement> | null = null
    public boardRef: RefObject<HTMLDivElement> | null = null
    public cellRef: RefObject<HTMLDivElement> | null = null

    constructor() {
        this.positionFigure = { x: 0, y: 0 }
        this.startPositionMouse = { x: 0, y: 0 }
        this.isMouseDown = false
    }

    public handleMouseUp = () => {
        if (this.figureRef?.current) {
            this.figureRef.current.style.transform = `translate(0, 0)`
        }
        this.positionFigure = { x: 0, y: 0 }
        this.startPositionMouse = { x: 0, y: 0 }
        this.isMouseDown = false
        this.boardRef = null
        this.figureRef = null
        this.cellRef = null
    }

    public setPositionFigure(positionFigure: coordinates) {
        this.positionFigure = positionFigure
    }

    public setStartPositionMouse(startPositionMouse: coordinates) {
        this.startPositionMouse = startPositionMouse
    }

    public setIsMouseDown(isMouseDown: boolean) {
        this.isMouseDown = isMouseDown
    }

    public handleMoveFigure(
        cell: Cell,
        selectedCell: Cell | null,
        setSelectedCell: (cell: Cell | null) => void
    ) {
        if (
            cell &&
            selectedCell &&
            selectedCell !== cell &&
            selectedCell.figure?.canMove(cell)
        ) {
            selectedCell.moveFigure(cell)
            setSelectedCell(null)
        } else {
            setSelectedCell(cell)
        }
    }

    public handleMouseMove = (event: MouseEvent) => {
        if (
            this.figureRef?.current &&
            this.boardRef?.current &&
            this.isMouseDown
        ) {
            const boardRect = this.boardRef.current.getBoundingClientRect()
    
            const left = event.clientX - boardRect.left
            const top = event.clientY - boardRect.top
            const right = boardRect.right - event.clientX
            const bottom = boardRect.bottom - event.clientY
    
            const xCorrection = left < -2 ? -left : right < -2 ? right : 0;
            const yCorrection = top < -2 ? -top : bottom < -2 ? bottom : 0;
    
            this.figureRef.current.style.transform = `translate(${
                event.clientX - this.startPositionMouse.x + xCorrection
            }px, ${
                event.clientY - this.startPositionMouse.y + yCorrection
            }px)`;
        }
    }
    

    public handleMouseDown = (
        event: React.MouseEvent,
        figureRef: RefObject<HTMLImageElement>,
        cellRef: RefObject<HTMLDivElement>,
        boardRef: RefObject<HTMLDivElement>
    ) => {
        if (figureRef?.current) {
            this.setIsMouseDown(true)
            this.figureRef = figureRef
            this.cellRef = cellRef
            this.boardRef = boardRef
            const figureRect = figureRef.current.getBoundingClientRect()
            const cursorRelativeBoard = {
                x: event.clientX,
                y: event.clientY,
            }
            const offsetStartPositionX =
                cursorRelativeBoard.x - figureRect.left - figureRect.width / 2
            const offsetStartPositionY =
                cursorRelativeBoard.y - figureRect.top - figureRect.height / 2

            this.setStartPositionMouse({
                x: event.clientX - offsetStartPositionX,
                y: event.clientY - offsetStartPositionY,
            })

            figureRef.current.style.transform = `translate(${offsetStartPositionX}px, ${offsetStartPositionY}px)`
        }
    }

    public detectedTargetCell = (cell: Cell | null, event: MouseEvent) => {
        if (this.cellRef?.current && cell) {
            const cellRect = this.cellRef.current.getBoundingClientRect()
            const offsetFigureX =
                event.clientX - this.startPositionMouse.x - cellRect.width / 2
            const offsetFigureY =
                event.clientY - this.startPositionMouse.y - cellRect.height / 2

            const targetCellX = Math.ceil(offsetFigureX / cellRect.width)
            const targetCellY = Math.ceil(offsetFigureY / cellRect.height)

            return cell.board.cells[cell.y + targetCellY][cell.x + targetCellX]
        }
    }
}

export default new moveFigureService()
