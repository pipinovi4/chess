import OnlineGameSocketService from '../services/gameServices/socketSevices/onlineGameSocketService'
import { Cell } from './cell/Cell'
import { Player } from './player/Player'

/**
 * GameModel class extends GameService to manage game-related logic and socket communication.
 */
class OnlineGameModel extends OnlineGameSocketService {
    private players: {currentPlayer: Player, opponentPlayer: Player} | null
    private moves: Array<string>
    private gameDuration: string
    private additionAfterMove: number

    constructor() {
        super()
        this.players = null
        this.moves = []
        this.gameDuration = '10 min'
        this.additionAfterMove = 0
    }

    public async prepareAndStartOnlineGame(): Promise<void> {
        try {
            const players = await this.startOnlineGame()
            if (players.currentPlayer && players.opponentPlayer) {
                this.players = players
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
                const moveChessNotation = await this.sendMoveOpponent(
                    selectedCell,
                    targetCell
                )
                if (moveChessNotation.match(/[a-h][1-8][a-h][1-8]/)) {
                    console.log('Move correct', moveChessNotation)
                    this.moves.push(moveChessNotation)
                } else {
                    console.error(
                        'When trying to send a move to your opponent, it was not correct: ',
                        moveChessNotation
                    )
                }
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

    public getPlayers(): {currentPlayer: Player, opponentPlayer: Player} | null {
        return this.players
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
