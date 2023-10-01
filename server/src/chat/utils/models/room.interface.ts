
import { Mute, RoomType } from "@prisma/client";

export interface Room {
    id?: number;
    name?: string;
    adminId?: number[];
    usersId?: number[];
    type?: RoomType;
    password?: string;
    imagePath?: string;
    mutes?: Mute[];
    blackList?:number[];
}