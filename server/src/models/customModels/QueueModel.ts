import { Socket } from "socket.io"

class QueueModel {
    /**
     * An array to store user IDs in the queue.
     * @type {Array<string>}
     */
    usersQueue: Array<string>

    constructor() {
        this.usersQueue = []
    }

    /**
     * Add a user to the queue.
     * @param {string} socketId - The ID of the user to add to the queue.
     */
    public addToQueue(socketId: string): void {
        this.usersQueue.push(socketId)
    }

    /**
     * @param {string} socketId - The ID of the user to remove from the queue.
     */
    public removeFromQueue(socketId: string): void {
        const index = this.usersQueue.indexOf(socketId)
        if (index !== -1) {
            this.usersQueue.splice(index, 1)
        }
    }

    /**
     * Find matching players in the queue.
     * If there are at least 2 users in the queue, it removes and returns two matched players.
     * @returns {Promise<string | null>} An object containing matched players (player1 and player2), or null if there are not enough players in the queue.
     */
    public findMatchingPlayer(socket: Socket): Promise<string | void> {
        return new Promise((resolve) => {
            console.log('this', this.usersQueue)
            if (this.usersQueue.length >= 1) {
                const opponent = this.usersQueue.slice(0, 1)[0]
                resolve(opponent)
            } 
            resolve()
        })
    }
}

export default QueueModel
