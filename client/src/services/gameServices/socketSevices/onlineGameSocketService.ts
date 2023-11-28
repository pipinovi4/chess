import { Socket, io } from 'socket.io-client'
import convertChessNotation from '../../../helpers/convertersNotation/convertAlgebraicNotation'
import { Cell } from '../../../entites/cell/Cell'
import createChessNotation from '../../../helpers/creatersNotation/createChessNotation'
import { Player } from '../../../entites/player/Player'
import Board from '../../../entites/board/Board'
import moveFigureService from '../../moveServices/moveFigureService'
import { fetchUserById } from '../../../https/api/databaseApi'

/**
 * Service for managing online game socket communication.
 */
class OnlineGameSocketService {
    private onlineSocket: Socket | null

    constructor() {
        this.onlineSocket = null
    }

    /**
     * Start an online game.
     */
    public startOnlineGame() {
        return new Promise<{
            opponentPlayer: Player
            socket: Socket
        }>((resolve) => {
            this.onlineSocket = io('https://localhost:5000/online-game')

            this.onlineSocket.emit('start-online-game')

            this.onlineSocket.on(
                'online-game-started',
                async (opponentId: string) => {
                    const opponentData = await fetchUserById(opponentId)
                    const opponentPlayer = new Player('current', opponentData)
                    if (this.onlineSocket)
                        resolve({
                            opponentPlayer,
                            socket: this.onlineSocket,
                        })
                }
            )
            this.onlineSocket.on('response-opponent-move', this.onMoveOpponent)
        })
    }

    /**
     * Send a move to the opponent in the online game.
     * @param {Cell} selectedCell
     * @param {Cell} targetCell
     * @returns {Promise<void>} A promise that resolves when the move is sent.
     */
    public async sendMoveOpponent(
        selectedCell: Cell,
        targetCell: Cell
    ): Promise<void> {
        if (targetCell && this.onlineSocket && selectedCell) {
            const moveChessNotation = createChessNotation(
                targetCell,
                selectedCell
            )
            console.log(moveChessNotation, 'in online game model')
            this.onlineSocket.emit('send-move-opponent', moveChessNotation)
        } else {
            throw new Error(
                'Unexpected error: targetCell or socket is undefined in send move to opponent'
            )
        }
    }

    /**
     * Handle the opponent's move in the online game.
     * @param {Object} move - The opponent's move data.
     * @returns {Object | null} The opponent's move if valid, or null.
     */
    public onMoveOpponent(
        move: string,
        currentBoard: Board,
        setBoard: React.Dispatch<React.SetStateAction<Board>>
    ): void {
        if (!move) {
            throw new Error(
                'Move from opponent is undefined in OnlineGameSocketService'
            )
        }

        const opponentMoveCells = convertChessNotation(move)
        const selectedCoordinates = opponentMoveCells?.selectedCell
        const targetCoordinates = opponentMoveCells?.targetCell

        if (!selectedCoordinates || !targetCoordinates) {
            throw new Error(
                'After converting the move, either selected or target coordinates were undefined'
            )
        }

        const selectedCell = currentBoard?.getCell(
            selectedCoordinates.x,
            selectedCoordinates.y
        )
        const targetCell = currentBoard?.getCell(
            targetCoordinates.x,
            targetCoordinates.y
        )

        if (!selectedCell || !targetCell) {
            throw new Error(
                'Selected or target cell is undefined in OnlineGameSocketService'
            )
        }

        if (selectedCell.figure?.canMove(targetCell) && setBoard) {
            moveFigureService.handleMoveFigure(
                targetCell,
                selectedCell,
                undefined,
                setBoard
            )
        } else {
            throw new Error(
                'The selected figure cannot move to the target cell'
            )
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
