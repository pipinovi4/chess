"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const userService_1 = __importDefault(require("../services/UserServices/userService"));
const validateUserData_1 = __importDefault(require("../helpers/validateUserData"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
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
        catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const { email, userName, password } = req.body;
            (0, validateUserData_1.default)(email, password, req, next);
            const userData = await userService_1.default.login(email, userName, password);
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
        catch (e) {
            next(e);
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService_1.default.activate(activationLink);
            return res.redirect('http://localhost:5173');
        }
        catch (e) {
            console.error(e);
            return ApiError_1.default.UnforseenError();
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
        catch (e) {
            console.error(e);
            return ApiError_1.default.UnforseenError();
        }
    }
    async findAuthData(req, res, next) {
        try {
            const { data, nameData } = req.body;
            if (!data) {
                return new ApiError_1.default(400, 'Not correct userName');
            }
            const user = await UserModel_1.default.findOne({ [nameData]: data });
            if (!user) {
                return res.status(200).json(null);
            }
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.default = new userController();
