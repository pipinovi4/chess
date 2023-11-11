export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: UserType
}

export interface UserType {
    email: string
    isActivated: boolean
    id: string
}