import { Room } from "./room.model";

export interface Mute {
    id?:number,
    roomId?:number,
    userId?:number,
    during?:number,
    createdAt?:Date,
    updatedAt?:Date,
    room?:Room
}