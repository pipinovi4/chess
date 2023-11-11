"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueModel {
    usersQueue;
    constructor() {
        this.usersQueue = [];
    }
    addToQueue(socketId) {
        this.usersQueue.push(socketId);
    }
    removeFromQueue(socketId) {
        const index = this.usersQueue.indexOf(socketId);
        if (index !== -1) {
            this.usersQueue.splice(index, 1);
        }
    }
    findMatchingPlayer(socket) {
        return new Promise((resolve) => {
            console.log('this', this.usersQueue);
            if (this.usersQueue.length >= 1) {
                const opponent = this.usersQueue.slice(0, 1)[0];
                resolve(opponent);
            }
            resolve();
        });
    }
}
exports.default = QueueModel;
