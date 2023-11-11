import ApiError from '../../exceptions/ApiError'
import UserDto from '../../dto/userDto'
import UserModel from '../../models/DB/UserModel'
import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import tokenService from './tokenService'
import MailService from './mailService'

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
                userName,
            })

            await MailService.sendActivationLink(
                email,
                `${process.env.API_URL}/authorization/activate/${activationLink}`
            )

            const userDto = new UserDto(user)
            const tokens = tokenService.generateToken({ ...userDto })

            if (!tokens) {
                throw ApiError.UnforeseenError()
            }

            await tokenService.saveToken(userDto._id, tokens.refreshToken)

            return { ...tokens, user: userDto }
        } catch (e) {
            console.error(e)
            throw ApiError.UnforeseenError()
        }
    }

    async login(personalInformation: string, password: string) {
        try {
            let user
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (emailRegex.test(personalInformation)) {
                console.log(
                    'ебать ты что себя тыквой возомнил я тебя на арьуз умножу'
                )
                user = await UserModel.findOne({ email: personalInformation })
                console.log(user, 'mama tukvi ne dovolona')
            } else {
                user = await UserModel.findOne({
                    userName: personalInformation,
                })
            }

            if (!user) {
                throw ApiError.UnAuthorizedError()
            }

            const isPassEqual = await bcrypt.compare(password, user.password)
            if (!isPassEqual) {
                throw ApiError.BadRequest('Password is not correct')
            }

            const userDto = new UserDto(user)

            const tokens = tokenService.generateToken({ ...userDto })

            if (!tokens) {
                throw ApiError.UnforeseenError(
                    'Error when trying create tokens'
                )
            }

            await tokenService.saveToken(userDto._id, tokens.refreshToken)

            return { ...tokens, user: userDto }
        } catch (error) {
            console.error('An error occurred during login:', error.message);
            if (error instanceof ApiError) {
                throw error;
            } else {
                throw ApiError.UnforeseenError('An unexpected error occurred during login');
            }
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
        const tokenFromDb = await tokenService.findToken(refreshToken)
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
