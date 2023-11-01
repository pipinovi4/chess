import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    timestamp: { type: Date, default: Date.now },
    messages: [MessageSchema]
});

export default model('Chat', ChatSchema);
