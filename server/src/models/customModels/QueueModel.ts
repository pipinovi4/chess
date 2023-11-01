/**
 * Class representing a queue for matching players.
 */
class QueueModel {
    /**
     * An array to store user IDs in the queue.
     * @type {Array<string>}
     */
    usersQueue: string[]

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
     * Remove a user from the queue.
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
     * @returns {Object|null} An object containing matched players (player1 and player2), or null if there are not enough players in the queue.
     */
    public findMatchingPlayer(
    ): Promise<string[] | void> {
        return new Promise((resolve, reject) => {
            if (this.usersQueue.length >= 2) {
                const players = this.usersQueue.slice(0, 1)
                        resolve(players)
                reject()
            } else {
                console.error('Unforseen error')
            }
        })
    }
}

export default QueueModel
