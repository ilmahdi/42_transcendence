export enum NotificationType {
    FRIEND_REQUEST,
    FRIEND_ACCEPTE,
    GAME_INVITE,
    GAME_ACCEPTE,
  }


export interface INotifyData {
    id: number,                  
    type: string,                
    seen: Boolean,                          
    notif_from : {
      username: string,               
      avatar: string,
    }       
    created_at: Date,
}

export interface INotification {
    from_id: number,
    to_id: number,              
    type?: string,       
}