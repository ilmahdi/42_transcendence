

export interface INotifyData {
    id: number,                  
    type: string,                
    seen: Boolean,   
    friendship_id?: number,                       
    notif_from : {
      id: number,
      username: string,               
      avatar: string,
    }       
    created_at: Date,
}

export interface INotification {
    from_id: number,
    to_id: number,              
    type?: string,       
    friendship_id?: number,       
}