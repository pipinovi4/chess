import { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/ApiError'
import userService from '../services/UserServices/userService'
import validateUserData from '../helpers/validateUserData'
import UserModel from '../models/DB/UserModel'

class userController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, userName } = req.body

            const userData = await userService.registration(
                email,
                password,
                userName
            )

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            })

            res.cookie('userId', userData.user._id, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            })

            return res.status(200).json({ userData })
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { personalInformation, password } = req.body
            const {refreshToken} = req.cookies

            validateUserData(personalInformation, password, req)

            const userData = await userService.login(personalInformation, password)
            console.log('user', userData)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            })
            res.cookie('userId', userData.user._id, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            })

            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect('http://localhost:5173')
        } catch (e) {
            console.error(e)
            return ApiError.UnforeseenError()
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const { refreshToken } = req.body
        const token = await userService.logout(refreshToken)
        res.clearCookie('refreshToken')
        res.clearCookie('userId')
        return res.json(token)
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken
            const userData = await userService.refresh(refreshToken)
            if (userData) {
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                })
                res.cookie('userId', userData.user._id, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                })
            }
        } catch (e) {
            console.error(e)
            return ApiError.UnforeseenError()
        }
    }

    async findAuthData(req: Request, res: Response, next: NextFunction) {
        try {
            const personalInformation = req.body

            if (!personalInformation) {
                return new ApiError(400, 'Not correct userName')
            }

            const user = await UserModel.findOne(personalInformation)

            if (!user) {
                return res.status(200).json(null)
            }

            res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }
}

export default new userController()
