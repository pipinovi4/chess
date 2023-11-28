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
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { personalInformation, password } = req.body
            const { refreshToken } = req.cookies

            validateUserData(personalInformation, password, req)

            const userData = await userService.login(
                personalInformation,
                password
            )
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
                secure: true,
            })

            return res.status(200).json(userData)
        } catch (error) {
            next(error)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect('http://localhost:5173')
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
        }
    }

    async findAuthData(req: Request, res: Response, next: NextFunction) {
        try {
            const personalInformation = req.body

            console.log(personalInformation)

            if (!personalInformation) {
                return new ApiError(400, 'Not correct userName')
            }

            const user = await UserModel.findOne(personalInformation)
            console.log(user)
            if (!user) {
                return res.status(200).json(null)
            }

            return res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    async updateUserAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const {newUserAvatar} = req.body
            const { userId } = req.cookies

            if (!newUserAvatar) {
                throw ApiError.BadRequest(
                    'New user avatar is unknown in update avatar'
                )
            }
            const user = await UserModel.findById(userId)

            user.avatar = newUserAvatar
            await user.save()
            return res.status(200)
        } catch (error) {
            console.error('Error during update user avatar:', error)
            throw error
        }
    }

    async updateUserName(req: Request, res: Response, next: NextFunction) {
        try {
            const {newUserName} = req.body
            const { userId } = req.cookies
            console.log(newUserName, userId)
            if (!newUserName) {
                throw ApiError.BadRequest(
                    'New user name is unknown in update user name'
                )
            }

            const user = await UserModel.findById(userId)

            user.userName = newUserName
            await user.save()
            return res.status(200)
        } catch (error) {
            next(error)
        }
    }
}

export default new userController()
