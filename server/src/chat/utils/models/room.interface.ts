import { RoomType } from "./roomType.enum";

export interface Room {
    id?:number;
    name?:string;
    adminId?:number[];
    usersIds?:number[];
    type?:RoomType;
    password?:string;
    imagePath?:string;
}