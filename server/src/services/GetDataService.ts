import { NextFunction, Request, Response } from "express";
import UserModel from "../models/DB/UserModel";
import ApiError from "../exceptions/ApiError";

class GetDataService {
    public async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            let userId = req.body.userId;


            if (!userId) {
                userId = req.cookies.userId;
            }

            if (!userId) {
                res.status(400).json({ message: 'User ID is missing' });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(401).json({ message: 'Unauthorized error, user was not found in the database' });
                throw ApiError.UnAuthorizedError();
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Unforeseen error when trying to fetch user by ID', error.message);
            next(error)
        }
    }
}

export default new GetDataService();

