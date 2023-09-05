export interface IUserData {
    id:number;
    username:string,
    avatar: string,
    wins: number,
    losses: number,
    draws:  number,
    games: number,
    rating: number,
    is_tfa_enabled?: boolean,
}


export interface IUserDataShort {
    id?:number;
    ft_id?:number;
    username?:string,
    avatar?: string,
}