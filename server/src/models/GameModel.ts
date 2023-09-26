import { Schema, model } from 'mongoose'

const GameModel = new Schema({
    moves: [{ type: String }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    timeStamp: { type: Date, default: Date.now() },
})

export default model('Game', GameModel)