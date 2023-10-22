"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenModel_1 = __importDefault(require("../models/TokenModel"));
const jwt = __importStar(require("jsonwebtoken"));
class tokenService {
    generateToken(payload) {
        if (process.env.REFRESH_SECRET_KEY && process.env.ACCESS_SECRET_KEY) {
            const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '15d' });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '15m' });
            return { accessToken, refreshToken };
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel_1.default.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await TokenModel_1.default.create({
            user: userId,
            refreshToken,
        });
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = await TokenModel_1.default.findOneAndDelete({ refreshToken });
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await TokenModel_1.default.findOne({ refreshToken });
        return tokenData;
    }
    validateAccessToken(token) {
        try {
            if (process.env.ACCESS_SECRET_KEY) {
                const userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
                return userData;
            }
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            if (process.env.REFRESH_SECRET_KEY) {
                const userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
                console.log('refreshToken-validator', userData);
                console.log(userData);
                console.log(21313123, userData);
                return userData;
            }
        }
        catch (e) {
            return null;
        }
    }
}
exports.default = new tokenService();
