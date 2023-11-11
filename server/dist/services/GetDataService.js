"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/DB/UserModel"));
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
class GetDataService {
    async getUserById(req, res, next) {
        try {
            let userId = req.body.userId;
            if (!userId) {
                userId = req.cookies.userId;
            }
            if (!userId) {
                res.status(400).json({ message: 'User ID is missing' });
            }
            const user = await UserModel_1.default.findById(userId);
            if (!user) {
                res.status(401).json({ message: 'Unauthorized error, user was not found in the database' });
                throw ApiError_1.default.UnAuthorizedError();
            }
            res.status(200).json(user);
        }
        catch (error) {
            console.error('Unforeseen error when trying to fetch user by ID', error.message);
            next(error);
        }
    }
}
exports.default = new GetDataService();
