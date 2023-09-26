import { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/ApiError'
import userService from '../services/userService'
import validateUserData from '../helpers/validateUserData'

class userController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const userIp = req.headers['x-forwarded-for']
            console.log(userIp)
            if (typeof userIp === 'string') {
                // Проверяем, что userIp действительно строка
                const trimmedUserIp = userIp.trim()

                const ips = trimmedUserIp.split(',')
                const userIpTrimmed = ips[0].trim()
                console.log('userIp', userIpTrimmed)
                console.log('userIp', userIp)
                const { email, password } = req.body
                validateUserData(email, password, req, next)

                const userData = await userService.registration(email, password)

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

                return res.status(200).json({ userData, userIp })
            }
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            validateUserData(email, password, req, next)

            const userData = await userService.login(email, password)

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
            return ApiError.UnforseenError()
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
            return ApiError.UnforseenError()
        }
    }
}

export default new userController()
