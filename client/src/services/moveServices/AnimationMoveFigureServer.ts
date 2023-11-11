import { RefObject } from 'react'
import { Cell } from '../../entites/cell/Cell'
import defaultMoveSoundMP3 from '../../sounds/move-self.mp3'
import captureSoundMP3 from '../../sounds/capture.mp3'
import castleSoundMP3 from '../../sounds/castle.mp3'
import { FigureNames } from '../../entites/figures/Figure'
import moveCheckSoundMP3 from '../../sounds/move-check.mp3'

class AnimationMoveFigureService {
    public async animateMoveFigure(
        selectedFigureRef: RefObject<HTMLImageElement> | null,
        targetCell: Cell,
        selectedCell: Cell,
        setSelectedCell: (cell: Cell | null) => void,
        setSelectedFigureRef: (
            figureRef: RefObject<HTMLImageElement> | null
        ) => void,
        figureRef: RefObject<HTMLImageElement> | undefined
    ) {
        const selectedCellFigureRefCurrent = selectedFigureRef?.current
        const selectedFigureRect =
            selectedFigureRef?.current?.getBoundingClientRect()
        const figureRefCurrentStyle = selectedCellFigureRefCurrent?.style

        if (selectedCellFigureRefCurrent && selectedFigureRect) {
            const xOffset =
                (targetCell.x - selectedCell.x) * selectedFigureRect.width
            const yOffset =
                (targetCell.y - selectedCell.y) * selectedFigureRect.height
            console.log(xOffset, yOffset)
            if (figureRefCurrentStyle && figureRef) {
                figureRefCurrentStyle.transition = `transform 0.075s ease`
                figureRefCurrentStyle.transform = `translate(${xOffset}px, ${yOffset}px)`

                const listener = async () => {
                await new Promise<void>((resolve) => {
                        selectedCell.moveFigure(targetCell)
                        setSelectedCell(null)
                        setSelectedFigureRef(null)
                        figureRefCurrentStyle.transition = `none`
                        selectedCellFigureRefCurrent.removeEventListener(
                            'transitionend',
                            listener
                        )
                        resolve()
                    })
                }

                selectedCellFigureRefCurrent.addEventListener(
                    'transitionend',
                    listener
                )
            }
        }
    }

    public async soundMove(
        targetCell: Cell,
        selectedCell: Cell | null,
        targetIsFigure: boolean
    ) {
        if (selectedCell?.board.kingCheckCell) {
            const checkSound = new Audio(moveCheckSoundMP3)
            await checkSound.play()
        } else if (
            selectedCell?.figure?.name === FigureNames.KING &&
            Math.abs(selectedCell.x - targetCell.x) === 2
        ) {
            const castleSound = new Audio(castleSoundMP3)
            castleSound.play()
        } else if (!targetIsFigure) {
            const defaultMoveSound = new Audio(defaultMoveSoundMP3)
            console.log('sound')
            defaultMoveSound.play()
        } else if (targetIsFigure) {
            const captureSound = new Audio(captureSoundMP3)
            console.log('sound')
            captureSound.play()
        }
    }
}

export default new AnimationMoveFigureService()
