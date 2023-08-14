export interface IUserData {
    id:number;
    username:string,
    avatar: string,
    wins: number,
    losses: number,
    draws:  number,
    rating: number,
}


export interface IUserDataShort {
    id?:number;
    username?:string,
    avatar?: string,
}