export enum NotificationType {
    FRIEND_REQUEST,
    FRIEND_ACCEPTE,
    GAME_INVITE,
    GAME_ACCEPTE,
  }


export interface INotifyData {
    id: number,                  
    username: string,               
    avatar: string,             
    type: NotificationType,                
    seen: Boolean,                          
    created_at: Date,
  }