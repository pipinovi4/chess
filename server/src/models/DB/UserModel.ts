import { Schema, model } from 'mongoose';
import fs from 'fs';
import path from 'path';

const defaultAvatarPath = path.join(__dirname, '..', '..', 'assets', 'default-user-avatar.png');

const base64DefaultAvatar = `data:image/png;base64,${fs.readFileSync(defaultAvatarPath, 'base64')}`

const UserModel = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userName: { type: String },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    avatar: { type: String, default: base64DefaultAvatar },
});

export default model('User', UserModel);
