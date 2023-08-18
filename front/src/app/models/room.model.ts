export interface Room {
    id?: number;
    adminId?:number;
    messages?: {message:string, date:Date}[];
    usersId?:number[]
}