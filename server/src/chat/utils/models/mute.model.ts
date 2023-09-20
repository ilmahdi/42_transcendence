// import { Room } from "./room.interface";

import { Room } from "@prisma/client";


export interface Mute {
    id?:number,
    roomId?:number,
    userId?:number,
    during?:number,
    createdAt?:Date,
    updatedAt?:Date,
    room?:Room
}