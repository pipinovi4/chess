import { Schema, model } from 'mongoose'

const GameModel = new Schema({
    moves: [{ type: String }],
    users: [{ type: String }],
    timeStamp: { type: Date, default: Date.now() },
    status: { type: String },
})

export default model('Game', GameModel)
