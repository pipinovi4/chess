import { Cell } from '../../entites/cell/Cell'
import defaultMoveSoundMP3 from '../../sounds/move-self.mp3'
import captureSoundMP3 from '../../sounds/capture.mp3'
import castleSoundMP3 from '../../sounds/castle.mp3'
import { FigureNames } from '../../entites/figures/Figure'
import moveCheckSoundMP3 from '../../sounds/move-check.mp3'

class AnimationMoveFigureService {
    public animateMoveFigure(targetCell: Cell, selectedCell: Cell) {
        if (selectedCell.figure) {
            const selectedFigureRect = document
                .getElementById(selectedCell.figure.id)
                ?.getBoundingClientRect()
            console.log(document.getElementById(selectedCell.figure.id))
            const figureRef = document.getElementById(selectedCell.figure.id)
            if (selectedFigureRect && figureRef) {
                const xOffset =
                    (targetCell.x - selectedCell.x) * selectedFigureRect.width
                const yOffset =
                    (targetCell.y - selectedCell.y) * selectedFigureRect.height
                figureRef.style.transition = `transform 0.5s ease`
                figureRef.style.transform = `translate(${xOffset}px, ${yOffset}px)`

                const listener = () => {
                    if (selectedCell.figure) {
                        document
                            .getElementById(selectedCell.figure.id)
                            ?.removeEventListener('transitionend', listener)
                    }
                }
                document
                    .getElementById(selectedCell.figure.id)
                    ?.addEventListener('transitionend', listener)
            }
        }
    }

    public async soundMove(
        targetCell: Cell,
        selectedCell: Cell | null,
        targetIsFigure: boolean
    ) {
        if (
            selectedCell?.board.historyMoves[
                selectedCell.board.historyMoves.length - 1
            ].includes('+')
        ) {
            console.log(selectedCell.board)
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
            defaultMoveSound.play()
        } else if (targetIsFigure) {
            const captureSound = new Audio(captureSoundMP3)
            captureSound.play()
        }
    }
}

export default new AnimationMoveFigureService()
