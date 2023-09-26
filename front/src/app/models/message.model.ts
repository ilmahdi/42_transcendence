import { IUserData } from "../utils/interfaces/user-data.interface";

export interface Message {
    id?: number;
    senderId?:number;
    receiverId?:number;
    message?: string;
    date?:Date;
    readed?:boolean;
    roomId?:number;
    sender?:IUserData;
    reciever?:IUserData;
}