export interface User {
    id?:number,
    ft_id?:number,
    username?:string,
    email?:string,
    tfa_secret?:string,
    is_tfa_enable?:boolean,
    avatar?:string,
    status?:string,
    created_at?:Date,
    updated_at?:Date
}
