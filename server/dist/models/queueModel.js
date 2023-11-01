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
    findMatchingPlayer(socketId) {
        return new Promise((resolve) => {
            if (this.usersQueue.length >= 2) {
                for (let i = 0; i < this.usersQueue.length; i++) {
                    if (this.userMatchingCheck(socketId, this.usersQueue[i])) {
                        resolve(this.usersQueue[i]);
                    }
                }
                resolve();
            }
            else {
                console.error('Unforseen error');
            }
        });
    }
    userMatchingCheck(socketId, player) {
        if (socketId !== player) {
            return true;
        }
        return false;
    }
}
exports.default = QueueModel;
