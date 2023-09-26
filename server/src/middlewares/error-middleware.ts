import ApiError from "../exceptions/ApiError"
import { Request, Response, NextFunction } from "express"

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err) 
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Unforseen error'})
}