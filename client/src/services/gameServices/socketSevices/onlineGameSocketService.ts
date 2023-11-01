import { Socket, io } from 'socket.io-client';
import { Cell } from '../../../entites/cell/Cell';
import { EngineMoveCells } from '../types';

const TIMEOUT_MS = 20000;

/**
 * Service for managing online game socket communication.
 */
class OnlineGameSocketService {
    /** The online socket connection. */
    onlineSocket: Socket | null = null;

    /**
     * Creates an instance of OnlineGameSocketService.
     */
    constructor() {
        this.onlineSocket = io('https://localhost:5000/online-game');
    }

    /**
     * Start an online game.
     * @returns {Promise<string>} A promise that resolves with the opponent's name.
     */
    startOnlineGame(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.onlineSocket?.emit('start-online-game');

            this.onlineSocket?.once(
                'online-game-started',
                (opponent: string) => {
                    console.log('Online game started');
                    clearTimeout(timeoutId);
                    resolve(opponent);
                }
            );

            this.onlineSocket?.on('move-opponent', this.onMoveOpponent);

            const timeoutId = setTimeout(() => {
                console.error('Timeout in starting an online game');
                reject('Start online game timeout');
            }, TIMEOUT_MS);
        });
    }

    /**
     * Send a move to the opponent in the online game.
     * @param {EngineMoveCells} move An object representing a move in the game.
     * @returns {Promise<void>} A promise that resolves when the move is sent.
     */
    sendMoveOpponent(move: EngineMoveCells): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (move.targetCell && this.onlineSocket) {
                this.onlineSocket?.emit('send-move-opponent', move);
                resolve();
            } else {
                console.error(
                    'Unexpected error: targetCell or socket is undefined in send move to opponent'
                );
                reject('Send move opponent error');
            }
        });
    }

    /**
     * Handle the opponent's move in the online game.
     * @param {Object} move - The opponent's move data.
     * @returns {Object | null} The opponent's move if valid, or null.
     */
    onMoveOpponent(move: {
        selectedCell: Cell;
        targetCell: Cell;
    }): { selectedCell: Cell; targetCell: Cell } | null {
        if (
            move.selectedCell.figure &&
            move.targetCell &&
            move.selectedCell.figure.canMove(move.targetCell)
        ) {
            return move;
        } else {
            console.error('Invalid move received from the opponent');
            return null;
        }
    }

    /**
     * Stop the online game.
     * @returns {Promise<void>} A promise that resolves when the online game is stopped.
     */
    stopOnlineGame(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.onlineSocket) {
                this.onlineSocket?.emit('stop-online-game');
                this.onlineSocket?.once('online-game-stopped', () => {
                    this.onlineSocket?.disconnect();
                    resolve();
                });
            } else {
                console.error(
                    'Socket is unknown when trying to stop the online game'
                );
                reject('Stop online game error');
            }
        });
    }
}

export default OnlineGameSocketService;
