import { Schema, model, Types, Document } from 'mongoose';

const UserModel = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userName: { type: String },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
});

export default model('User', UserModel);