"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const userService_1 = __importDefault(require("../services/UserServices/userService"));
const validateUserData_1 = __importDefault(require("../helpers/validateUserData"));
const UserModel_1 = __importDefault(require("../models/DB/UserModel"));
class userController {
    async registration(req, res, next) {
        try {
            const { email, password, userName } = req.body;
            const userData = await userService_1.default.registration(email, password, userName);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            res.cookie('userId', userData.user._id, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.status(200).json({ userData });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { personalInformation, password } = req.body;
            const { refreshToken } = req.cookies;
            (0, validateUserData_1.default)(personalInformation, password, req);
            const userData = await userService_1.default.login(personalInformation, password);
            console.log('user', userData);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            res.cookie('userId', userData.user._id, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            return res.status(200).json(userData);
        }
        catch (error) {
            next(error);
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService_1.default.activate(activationLink);
            return res.redirect('http://localhost:5173');
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        const { refreshToken } = req.body;
        const token = await userService_1.default.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('userId');
        return res.json(token);
    }
    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const userData = await userService_1.default.refresh(refreshToken);
            if (userData) {
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
                res.cookie('userId', userData.user._id, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async findAuthData(req, res, next) {
        try {
            const personalInformation = req.body;
            console.log(personalInformation);
            if (!personalInformation) {
                return new ApiError_1.default(400, 'Not correct userName');
            }
            const user = await UserModel_1.default.findOne(personalInformation);
            console.log(user);
            if (!user) {
                return res.status(200).json(null);
            }
            return res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUserAvatar(req, res, next) {
        try {
            const { newUserAvatar } = req.body;
            const { userId } = req.cookies;
            if (!newUserAvatar) {
                throw ApiError_1.default.BadRequest('New user avatar is unknown in update avatar');
            }
            const user = await UserModel_1.default.findById(userId);
            user.avatar = newUserAvatar;
            await user.save();
            return res.status(200);
        }
        catch (error) {
            console.error('Error during update user avatar:', error);
            throw error;
        }
    }
    async updateUserName(req, res, next) {
        try {
            const { newUserName } = req.body;
            const { userId } = req.cookies;
            console.log(newUserName, userId);
            if (!newUserName) {
                throw ApiError_1.default.BadRequest('New user name is unknown in update user name');
            }
            const user = await UserModel_1.default.findById(userId);
            user.userName = newUserName;
            await user.save();
            return res.status(200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new userController();
