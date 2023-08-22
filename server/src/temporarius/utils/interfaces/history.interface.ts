export interface IPlayer {
    username : string,
    avatar : string,
    rating: number,
    score: number,
    points: number,
}

export interface IHistory {
    player1 : IPlayer,
    player2 : IPlayer,

    date : Date,
    duration : {
        min: number,
        sec: number,
    },
}