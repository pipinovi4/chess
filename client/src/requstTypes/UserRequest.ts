export default interface UserRequest {
    email: string,
    userName: string,
    avatar: Uint8Array,
    activationLink: string,
    isActivated: boolean,
    password: string,
}