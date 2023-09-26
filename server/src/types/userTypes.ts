import { ClientSession, Types} from "mongoose";

export interface userDto {
    email: string;
    _id: Types.ObjectId;
    isActivated: boolean;
}

export interface userModel {
    email: string;
    _id: Types.ObjectId;
    isActivated: boolean;
    avatar?: Types.ObjectId | undefined; // Оновлено тип avatar
    userName?: string | undefined;
    activationLink?: string | undefined;
}
