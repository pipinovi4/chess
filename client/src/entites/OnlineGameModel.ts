import OnlineGameService from '../services/gameServices/gameServices/onlineGameService'
import { EngineMoveCells } from '../services/gameServices/types'

/**
 * GameModel class extends GameService to manage game-related logic and socket communication.
 */
class OnlineGameModel extends OnlineGameService {
    protected connection = false
    protected lastMove: EngineMoveCells | null = null
    protected currentHalfMove = 0
    protected players: Array<string> = []

    public async prepareAndStartOnlineGame(): Promise<void> {
        try {
            const opponent = await this.startOnlineGame()
            if (opponent) {
                this.addPlayer(opponent)
                this.setConnection()
            } else {
                console.error('opponent undefined')
            }
        } catch (error) {
            console.error(error)
        }
    }

    public async prepareAndSendMoveOpponent(move: EngineMoveCells) {
        try {
            if (move && move.selectedCell.figure?.canMove(move.targetCell)) {
                await this.sendMoveOpponent(move)
            } else {
                console.error('Move is incorrect')
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

    get getLastMove(): EngineMoveCells | null {
        return this.lastMove
    }

    get getCurrentHalfMove(): number {
        return this.currentHalfMove
    }

    get getPlayers(): Array<string> {
        return this.players
    }

    constructor() {
        super()
    }

    /**
     * Add a player to the game.
     * @param {Player} player - The player to add to the game.
     */
    protected addPlayer(player: string) {
        if (this.players.length !== 2) {
            this.players.push(player)
        } else {
            console.error('Max number of players in the game')
        }
    }

    /**
     * Toggle the connected state.
     */
    protected setConnection() {
        this.connection = !this.connection
    }
}

export default OnlineGameModel
