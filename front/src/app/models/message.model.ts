export interface Message {
    id?: number;
    senderId?:number;
    receiverId?:number;
    message?: string;
    date?:Date
}