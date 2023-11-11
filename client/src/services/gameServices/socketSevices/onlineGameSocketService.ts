import { Socket, io } from 'socket.io-client'
import convertChessNotation from '../../../helpers/convertChessNotation'
import { Cell } from '../../../entites/cell/Cell'
import createChessNotation from '../../../helpers/createChessNotation'
import { Player } from '../../../entites/player/Player'
import { Colors } from '../../../constants/Colors'

/**
 * Service for managing online game socket communication.
 */
class OnlineGameSocketService {
    private onlineSocket: Socket | null
    private currentOpponentMove: string | null

    constructor() {
        this.onlineSocket = null
        this.currentOpponentMove = null
    }

    /**
     * Start an online game.
     */
    public startOnlineGame() {
        return new Promise<{ currentPlayer: Player; opponentPlayer: Player }>(
            (resolve) => {
                this.onlineSocket = io('https://localhost:5000/online-game')

                this.onlineSocket.emit('start-online-game')

                this.onlineSocket.on(
                    'online-game-started',
                    (players: { currentId: string; opponentId: string }) => {
                        const randomColor =
                            Math.random() > 0.5 ? Colors.WHITE : Colors.BLACK
                        const opponentPlayer = new Player(
                            randomColor,
                            'player',
                            players.opponentId
                        )
                        const currentPlayer = new Player(
                            randomColor === Colors.BLACK
                                ? Colors.WHITE
                                : Colors.BLACK,
                            'player',
                            players.currentId
                        )
                        console.log(players)
                        resolve({ currentPlayer, opponentPlayer })
                    }
                )

                this.onlineSocket.on(
                    'response-opponent-move',
                    this.onMoveOpponent
                )
            }
        )
    }

    /**
     * Send a move to the opponent in the online game.
     * @param {Cell} selectedCell
     * @param {Cell} targetCell
     * @returns {Promise<void>} A promise that resolves when the move is sent.
     */
    public sendMoveOpponent(
        selectedCell: Cell,
        targetCell: Cell
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            if (targetCell && this.onlineSocket && selectedCell) {
                const moveChessNotation = createChessNotation(
                    targetCell,
                    selectedCell
                )
                console.log(moveChessNotation, 'in online game model')
                this.onlineSocket?.emit('send-move-opponent', moveChessNotation)
                resolve(moveChessNotation)
            } else {
                console.error(
                    'Unexpected error: targetCell or socket is undefined in send move to opponent'
                )
                reject('Send move opponent error')
            }
        })
    }

    /**
     * Handle the opponent's move in the online game.
     * @param {Object} move - The opponent's move data.
     * @returns {Object | null} The opponent's move if valid, or null.
     */
    public onMoveOpponent(move: string): string | null {
        const moveCoordinates = convertChessNotation(move)
        if (
            moveCoordinates.selectedCell.figure &&
            moveCoordinates.targetCell &&
            moveCoordinates.selectedCell.figure.canMove(
                moveCoordinates.targetCell
            )
        ) {
            this.currentOpponentMove = move // Сохраняем ход
            return move
        } else {
            console.error('Invalid move received from the opponent')
            return null
        }
    }

    /**
     * Stop the online game.
     * @returns {Promise<void>} A promise that resolves when the online game is stopped.
     */
    public stopOnlineGame(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.onlineSocket) {
                this.onlineSocket?.emit('stop-online-game')
                this.onlineSocket?.once('online-game-stopped', () => {
                    this.onlineSocket?.disconnect()
                    resolve()
                })
            } else {
                console.error(
                    'Socket is unknown when trying to stop the online game'
                )
                reject('Stop online game error')
            }
        })
    }
}

export default OnlineGameSocketService
