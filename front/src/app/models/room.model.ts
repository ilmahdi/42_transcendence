import { Mute } from "./mutes.model";
import { RoomType } from "./roomType.enum";

export interface Room {
    id?: number;
    adminId?:number[];
    name?:string;
    usersId?:number[];
    type?:RoomType;
    password?:string;
    imagePath?:string;
    mutes?:Mute[];
    blackList?:number[];
}