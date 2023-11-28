import { FC, useEffect, useState } from 'react'
import { Figure } from '../../../entites/figures/Figure'
import './style.scss'
import Board from '../../../entites/board/Board'
import { Player } from '../../../entites/player/Player'

interface LostFiguresProps {
    board: Board,
    player: Player | undefined
}

const LostFigures: FC<LostFiguresProps> = ({ board, player }) => {
    const [lostFigures, setLostFigures] = useState<Array<Figure>>([])
    const figureLists: Record<string, Figure[]> = {}

    useEffect(() => {
        setLostFigures(board.lostFigures)
    }, [board.lostFigures])

    lostFigures.forEach((lostFigure) => {
        if (lostFigure && lostFigure.name) {
            if (!figureLists[lostFigure.name]) {
                figureLists[lostFigure.name] = []
            }
            if (player?.color !== lostFigure.color) {
                figureLists[lostFigure.name].push(lostFigure)
            }
        }
    })

    return (
        <>
            {Object.entries(figureLists).map(([figureName, figures]) => (
                <div
                    key={figureName}
                    className='lost-figures'
                >
                    {figures.map((lostFigure) => (
                        <img
                            key={lostFigure.id} // Предполагая, что у фигуры есть уникальный идентификатор (id)
                            className={[
                                `lost-figure__${lostFigure.name.toLowerCase()}`,
                            ].join(' ')}
                            src={lostFigure.logo ?? undefined}
                            alt="chess-figure"
                        />
                    ))}
                </div>
            ))}
        </>
    )
}

export default LostFigures
