import { Schema, model } from "mongoose";

const SearchQueueSchema = new Schema({
    socketId: { type: String, required: true},
    eloPoints: {type: Number, required: true},
}) 

export default model('SearchQueue', SearchQueueSchema)