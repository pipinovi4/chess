"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const defaultAvatarPath = path_1.default.join(__dirname, '..', '..', 'assets', 'default-user-avatar.png');
const base64DefaultAvatar = `data:image/png;base64,${fs_1.default.readFileSync(defaultAvatarPath, 'base64')}`;
const UserModel = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userName: { type: String },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    avatar: { type: String, default: base64DefaultAvatar },
});
exports.default = (0, mongoose_1.model)('User', UserModel);
