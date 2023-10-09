"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserModel = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userName: { type: String },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    avatar: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' },
});
exports.default = (0, mongoose_1.model)('User', UserModel);
