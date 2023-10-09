import { RefObject } from 'react';
import { Cell } from '../../entites/cell/Cell'
import moveFigure from './moveFigure'

type coordinates = { x: number; y: number }

class moveFigureDragging {
    public positionFigure: coordinates
    public startPositionMouse: coordinates
    public isMouseDown: boolean
    public figureRef: RefObject<HTMLImageElement> | null
    public currentCell: Cell | null = null

    constructor() {
        this.positionFigure = { x: 0, y: 0 }
        this.startPositionMouse = { x: 0, y: 0 }
        this.isMouseDown = false
        this.figureRef = null
    }

    public setCurrentCell(cell: Cell) {
        this.currentCell = cell
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

    public setFigureRef(figureRef: RefObject<HTMLImageElement>) {
        this.figureRef = figureRef
    }

    public handleMouseMove = (
        cellRef: React.RefObject<HTMLDivElement | null>,
        boardRef: React.RefObject<HTMLDivElement | null>,
        event: MouseEvent
    ) => {
        if (
            this.figureRef?.current &&
            boardRef.current &&
            cellRef.current &&
            this.isMouseDown
        ) {
            const figureRect = this.figureRef.current.getBoundingClientRect()
            const containerRect = boardRef.current.getBoundingClientRect()
            const cellRect = cellRef.current.getBoundingClientRect()

            const left = event.clientX - containerRect.left
            const top = event.clientY - containerRect.top
            const right = left + figureRect.width
            const bottom = top + figureRect.height

            this.setPositionFigure({
                x: event.clientX - this.startPositionMouse.x,
                y: event.clientY - this.startPositionMouse.y,
            })
            this.figureRef.current.style.transform = `translate(${
                event.clientX - this.startPositionMouse.x
            }px, ${event.clientY - this.startPositionMouse.y}px)`
        }
    }

    public handleMouseDown = (
        event: React.MouseEvent
    ) => {
        if (this.figureRef?.current) {
            this.setIsMouseDown(true)
            const figureRect = this.figureRef.current.getBoundingClientRect()
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
            this.figureRef.current.style.transform = `translate(${offsetStartPositionX}px, ${offsetStartPositionY}px)`
        }
    }

    public handleMouseUp = (
    ) => {
        if (this.figureRef?.current) {
            this.setIsMouseDown(false)
            this.figureRef.current.style.transform = `translate(0, 0)`
        }
    }

    public detectedTargetCell = (
        cellRef: React.RefObject<HTMLDivElement | null>,
        cell: Cell,
        event: MouseEvent
    ) => {
        if (cellRef.current) {
            const cellRect = cellRef.current.getBoundingClientRect()
            const offsetFigureX =
                event.clientX - this.startPositionMouse.x - cellRect.width / 2
            const offsetFigureY =
                event.clientY - this.startPositionMouse.y - cellRect.height / 2

            const targetCellX = Math.ceil(offsetFigureX / cellRect.width)
            const targetCellY = Math.ceil(offsetFigureY / cellRect.height)

            console.log(cell.board.cells[cell.y + targetCellY][cell.x + targetCellX])

            return cell.board.cells[cell.y + targetCellY][cell.x + targetCellX]
        }
    }
}

export default new moveFigureDragging()
