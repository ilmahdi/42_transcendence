export interface Message {
    id?:number,
    channel_id?:number,
    text_message?:string,
    sent_at?:Date,
    author?:number
}