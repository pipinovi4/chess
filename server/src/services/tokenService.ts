import { Types } from 'mongoose'
import userDto from '../exceptions/dto/userDto'
import TokenModel from '../models/TokenModel'
import * as jwt from 'jsonwebtoken'

class tokenService {
    generateToken(payload: userDto) {
        if (process.env.REFRESH_SECRET_KEY && process.env.ACCESS_SECRET_KEY) {
            const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '15d' })
            const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '15m'})

            return {accessToken, refreshToken}
        }
    }

    async saveToken(userId: Types.ObjectId, refreshToken: string) {
        const tokenData = await TokenModel.findOne({ user: userId })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await TokenModel.create({
            user: userId,
            refreshToken
        })

        return token
    }

    async removeToken(refreshToken: string) {
        const tokenData = await TokenModel.findOneAndDelete({ refreshToken })
        return tokenData
    }

    async findToken(refreshToken: string) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData
    }

    validateAccessToken(token: string) {
        try {
            if (process.env.ACCESS_SECRET_KEY) {
                const userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
                return userData
            }
        } catch(e) {
            return null
        }
    }

    validateRefreshToken(token: string) {
        try {
            if (process.env.REFRESH_SECRET_KEY) {
                const userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
                console.log('refreshToken-validator', userData)
                console.log(userData)
                console.log(21313123, userData)
                return userData
            }
        } catch(e) {
            return null
        }
    }
}

export default new tokenService()