import ApiError from '../exceptions/ApiError'
import UserDto from '../exceptions/dto/userDto'
import TokenModel from '../models/TokenModel'
import UserModel from '../models/UserModel'
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import tokenService from './tokenService'
import MailService from './mailService'
import { ClientSession, startSession } from 'mongoose'
import { userModel } from '../types/userTypes'

class userService {
    async registration(email: string, password: string, userName: string) {
        try {
            const candidate = await UserModel.findOne({ email })

            if (candidate) {
                throw ApiError.BadRequest('User with email already exists')
            }

            const hashPassword = await bcrypt.hash(password, 7)
            const activationLink = uuid.v4()
            const user = await UserModel.create({
                email,
                password: hashPassword,
                activationLink,
                userName
            })

            await MailService.sendActivationLink(
                email,
                `${process.env.API_URL}/authorization/activate/${activationLink}`
            )

            const userDto = new UserDto(user)
            const tokens = tokenService.generateToken({ ...userDto })

            if (!tokens) {
                throw ApiError.UnforseenError()
            }

            await tokenService.saveToken(userDto._id, tokens.refreshToken)

            return { ...tokens, user: userDto }
        } catch (e) {
            console.error(e)
            throw ApiError.UnforseenError()
        }
    }

    async login(email: string, userName: string, password: string) {
        try {
            let user
            if (email)  {
                user = await UserModel.findOne({ email })
            } else {
                user = await UserModel.findOne({ userName })
            }
            if (!user) {
                throw ApiError.BadRequest('User was not found')
            }

            const isPassEqual = await bcrypt.compare(password, user.password)
            if (!isPassEqual) {
                throw ApiError.BadRequest('Password is not correct')
            }

            const userDto = new UserDto(user)

            const tokens = tokenService.generateToken({ ...userDto })

            if (!tokens) {
                throw ApiError.UnforseenError()
            }

            await tokenService.saveToken(userDto._id, tokens.refreshToken)

            return { ...tokens, user: userDto }
        } catch (e) {
            console.error(e)
            throw ApiError.UnforseenError()
        }
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Uncorrect link')
        }

        user.isActivated = true
        await user.save()
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
        }
        console.log(1)
        const userData = tokenService.validateRefreshToken(refreshToken)
        console.log(22, userData)
        console.log(2)
        const tokenFromDb = await tokenService.findToken( refreshToken )
        console.log(3)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnAuthorizedError()
        }
        const user = await UserModel.findById(userData)
        if (user) {
            const userDto = new UserDto(user)
            const tokens = tokenService.generateToken({ ...userDto })

            if (!tokens) {
                throw ApiError.UnAuthorizedError()
            }

            await tokenService.saveToken(userDto._id, tokens.refreshToken)
            return { ...tokens, user: userDto }
        }
    }
}

export default new userService()
