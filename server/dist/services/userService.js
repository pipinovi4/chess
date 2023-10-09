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
const userDto_1 = __importDefault(require("../exceptions/dto/userDto"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcrypt = __importStar(require("bcrypt"));
const uuid = __importStar(require("uuid"));
const tokenService_1 = __importDefault(require("./tokenService"));
const mailService_1 = __importDefault(require("./mailService"));
class userService {
    registration(email, password, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidate = yield UserModel_1.default.findOne({ email });
                if (candidate) {
                    throw ApiError_1.default.BadRequest('User with email already exists');
                }
                const hashPassword = yield bcrypt.hash(password, 7);
                const activationLink = uuid.v4();
                const user = yield UserModel_1.default.create({
                    email,
                    password: hashPassword,
                    activationLink,
                    userName
                });
                yield mailService_1.default.sendActivationLink(email, `${process.env.API_URL}/authorization/activate/${activationLink}`);
                const userDto = new userDto_1.default(user);
                const tokens = tokenService_1.default.generateToken(Object.assign({}, userDto));
                if (!tokens) {
                    throw ApiError_1.default.UnforseenError();
                }
                yield tokenService_1.default.saveToken(userDto._id, tokens.refreshToken);
                return Object.assign(Object.assign({}, tokens), { user: userDto });
            }
            catch (e) {
                console.error(e);
                throw ApiError_1.default.UnforseenError();
            }
        });
    }
    login(email, userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (email) {
                    user = yield UserModel_1.default.findOne({ email });
                }
                else {
                    user = yield UserModel_1.default.findOne({ userName });
                }
                if (!user) {
                    throw ApiError_1.default.BadRequest('User was not found');
                }
                const isPassEqual = yield bcrypt.compare(password, user.password);
                if (!isPassEqual) {
                    throw ApiError_1.default.BadRequest('Password is not correct');
                }
                const userDto = new userDto_1.default(user);
                const tokens = tokenService_1.default.generateToken(Object.assign({}, userDto));
                if (!tokens) {
                    throw ApiError_1.default.UnforseenError();
                }
                yield tokenService_1.default.saveToken(userDto._id, tokens.refreshToken);
                return Object.assign(Object.assign({}, tokens), { user: userDto });
            }
            catch (e) {
                console.error(e);
                throw ApiError_1.default.UnforseenError();
            }
        });
    }
    activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.default.findOne({ activationLink });
            if (!user) {
                throw ApiError_1.default.BadRequest('Uncorrect link');
            }
            user.isActivated = true;
            yield user.save();
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield tokenService_1.default.removeToken(refreshToken);
            return token;
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
            }
            console.log(1);
            const userData = tokenService_1.default.validateRefreshToken(refreshToken);
            console.log(22, userData);
            console.log(2);
            const tokenFromDb = yield tokenService_1.default.findToken(refreshToken);
            console.log(3);
            if (!userData || !tokenFromDb) {
                throw ApiError_1.default.UnAuthorizedError();
            }
            const user = yield UserModel_1.default.findById(userData);
            if (user) {
                const userDto = new userDto_1.default(user);
                const tokens = tokenService_1.default.generateToken(Object.assign({}, userDto));
                if (!tokens) {
                    throw ApiError_1.default.UnAuthorizedError();
                }
                yield tokenService_1.default.saveToken(userDto._id, tokens.refreshToken);
                return Object.assign(Object.assign({}, tokens), { user: userDto });
            }
        });
    }
}
exports.default = new userService();
