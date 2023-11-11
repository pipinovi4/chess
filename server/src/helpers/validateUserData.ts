import { validationResult } from "express-validator"
import { NextFunction, Request } from "express"
import ApiError from "../exceptions/ApiError"

const validateUserData = (personalInformation: string, password: string, req: Request) => {
        const errors = validationResult(req)
        const validationError = errors.array().map(error => new Error(error.msg))
        console.log(personalInformation, 'abetka dolboeb')
        if (!personalInformation || !password) {
            throw ApiError.BadRequest('Personal information and password required')
        }
        
        if (!errors.isEmpty()) {
            throw ApiError.BadRequest('Error on validation', validationError)
        }

}

export default validateUserData