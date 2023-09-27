// import { RoomType } from "./roomType.enum";

import { Mute, RoomType } from "@prisma/client";
// import { Mute } from "./mute.model";

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