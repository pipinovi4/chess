import React from 'react'
import OnlineGameSocketService from '../services/gameServices/socketSevices/onlineGameSocketService'
import Board from './board/Board'
import { Cell } from './cell/Cell'
import { Player } from './player/Player'

/**
 * GameModel class extends GameService to manage game-related logic and socket communication.
 */
class OnlineGameModel extends OnlineGameSocketService {
    private opponentPlayer: Player | null
    private gameDuration: string
    private additionAfterMove: number
    public setBoard: React.Dispatch<React.SetStateAction<Board>>
    public board: Board
    public gameStarted = false

    constructor(
        setBoard: React.Dispatch<React.SetStateAction<Board>>,
        board: Board
    ) {
        super()
        this.setBoard = setBoard
        this.board = board
        this.opponentPlayer = null
        this.gameDuration = '10 min'
        this.additionAfterMove = 0
    }

    public async prepareAndStartOnlineGame(): Promise<void> {
        try {
            console.log(this.setBoard, 'fdsljfnsfqq21392031239123-123')
            const onlineGameData = await this.startOnlineGame()
            if (onlineGameData.opponentPlayer) {
                this.gameStarted = true
                onlineGameData.socket.on(
                    'opponent-game-move',
                    (move: string) => {
                        if (this.setBoard && this.board) {
                            if (this.board) {
                                this.onMoveOpponent(
                                    move,
                                    this.board,
                                    this.setBoard
                                )
                            }
                        } else {
                            throw new Error(
                                "At the moment of receiving the opponent's move, the board is not defined in the OnlineGameModel class"
                            )
                        }
                    }
                )
                this.opponentPlayer = onlineGameData.opponentPlayer
            } else {
                console.error(
                    'Error: Players after successful match-making are incorrect.'
                )
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    public async prepareAndSendMoveOpponent(
        selectedCell: Cell | null,
        targetCell: Cell
    ) {
        try {
            if (selectedCell && selectedCell.figure?.canMove(targetCell)) {
                await this.sendMoveOpponent(
                    selectedCell,
                    targetCell
                )
            } else {
                console.error(
                    'Move is incorrect when trying send move opponent'
                )
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public async prepareAndStopOnlineGame() {
        try {
            await this.stopOnlineGame()
        } catch (error) {
            console.error(error)
        }
    }

    public getOpponentPlayer(): Player | null {
        return this.opponentPlayer
    }

    public setGameDurationMode(gameDurationMove: string) {
        this.gameDuration = gameDurationMove
        if (gameDurationMove.includes('min')) {
            this.additionAfterMove = 0
        } else {
            const match = gameDurationMove.match(/\| (\d+)/)
            if (match) {
                this.additionAfterMove = parseInt(match[1], 10)
            } else {
                console.error(
                    'Game duration mode is not correct when trying set it'
                )
                this.additionAfterMove = 0
            }
        }
    }

    public getAdditionAfterMove() {
        return this.additionAfterMove
    }

    get _gameDuration() {
        return this.converteDuration(this.gameDuration)
    }

    public converteDuration(gameDuration: string) {
        const durationMatch = gameDuration.match(/\d+/)
        if (durationMatch) {
            const durationValue = parseInt(durationMatch[0])
            return durationValue * 60
        }
        return 10 * 60
    }
}

export default OnlineGameModel
