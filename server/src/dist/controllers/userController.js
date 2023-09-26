"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const userService_1 = __importDefault(require("../services/userService"));
const validateUserData_1 = __importDefault(require("../helpers/validateUserData"));
class userController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userIp = req.headers['x-forwarded-for'];
                console.log(userIp);
                if (typeof userIp === 'string') {
                    const trimmedUserIp = userIp.trim();
                    const ips = trimmedUserIp.split(',');
                    const userIpTrimmed = ips[0].trim();
                    console.log('userIp', userIpTrimmed);
                    console.log('userIp', userIp);
                    const { email, password } = req.body;
                    (0, validateUserData_1.default)(email, password, req, next);
                    const userData = yield userService_1.default.registration(email, password);
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
                    return res.status(200).json({ userData, userIp });
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                (0, validateUserData_1.default)(email, password, req, next);
                const userData = yield userService_1.default.login(email, password);
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
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                yield userService_1.default.activate(activationLink);
                return res.redirect('http://localhost:5173');
            }
            catch (e) {
                console.error(e);
                return ApiError_1.default.UnforseenError();
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            const token = yield userService_1.default.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.clearCookie('userId');
            return res.json(token);
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                const userData = yield userService_1.default.refresh(refreshToken);
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
        });
    }
}
exports.default = new userController();
//# sourceMappingURL=userController.js.map