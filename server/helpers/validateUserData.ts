import { validationResult } from "express-validator"
import { NextFunction, Request } from "express"
import ApiError from "../exceptions/ApiError"

const validateUserData = (email: string, password: string, req: Request, next: NextFunction) => {
        const errors = validationResult(req)
        const validationError = errors.array().map(error => new Error(error.msg))
        
        if (!email || !password) {
            throw ApiError.BadRequest('Email and password required')
        }
        
        if (!errors.isEmpty()) {
            throw ApiError.BadRequest('Error on validation', validationError)
        }

}

export default validateUserData