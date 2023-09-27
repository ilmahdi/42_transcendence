export interface UserData {
    username:string,
    avatar: string,
    wins: number,
    losses: number,
    draws:  number,
    rating: number,
}


export interface UserDataShort {
    id: number,
    username:string,
    avatar: string,
    rating: number,
}