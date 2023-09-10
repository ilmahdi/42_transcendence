import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { UserService } from 'src/app/services/user.service';
import { IFriendship } from 'src/app/utils/interfaces/friendship.interface';
import { INotification, INotifyData, NotificationType } from 'src/app/utils/interfaces/notify-data.interface';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private menuBarService: MenuBarService,
  ) { }

  @Input() notifyData: INotifyData[] = [];

  @Output() buttonClickEvent :EventEmitter<void> = new EventEmitter<void>();

  public NotificationType = NotificationType;
  public loggedInUserId :number = this.authService.getLoggedInUserId();

  ngOnInit(): void {
    
  }

  async onAcceptClick(index :number) {
    
    this.buttonClickEvent.emit();
    const target_id = this.notifyData[index].notif_from.id;
    
    await this.changeFriendshipStatus(this.notifyData[index].friendship_id!, "ACCEPTED")
    await this.updateNotification(this.getNotification(this.loggedInUserId, target_id,'FRIEND_ACCEPTE'));
    
    
    this.menuBarService.sendEvent("notifyFriendRequest", target_id)
    
    this.menuBarService.sendEvent("refreshUser", target_id)
    this.menuBarService.sendEvent("refreshUser", this.loggedInUserId)
  }
  
  
  
  async onCancelClick(index :number) {
    
    this.buttonClickEvent.emit();
    const target_id = this.notifyData[index].notif_from.id;
    
    await this.cancelFriend(this.notifyData[index].friendship_id!)
    await this.deleteFriendshipNotification(this.getNotification(this.loggedInUserId, target_id));


    this.menuBarService.sendEvent("refreshUser", target_id)
    this.menuBarService.sendEvent("refreshUser", this.loggedInUserId)
  }




  async changeFriendshipStatus (friendshipId :number,friendshipStatus :string) {

    try {
      await firstValueFrom(this.userService.changeFriendshipStatus(friendshipId, friendshipStatus));
      
    } catch (error) {
      console.error('Error:', error);
    }
  }
  async cancelFriend (friendshipId :number) {

    try {
      await firstValueFrom(this.userService.cancelFriend(friendshipId));
      
    } catch (error) {
      console.error('Error:', error);
    }
  }




  async updateNotification(notification :INotification) {

    try {
      await firstValueFrom(this.menuBarService.updateNotification(notification));
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async deleteFriendshipNotification(notification :INotification) {

    try {
      await firstValueFrom(this.menuBarService.deleteFriendshipNotification(notification));
      
    } catch (error) {
      console.error('Error:', error);
    }
  }





  // private utility functions
  /******************************************************************** */
  getFriendship (arg1 :number, arg2 :number, arg3? :string) :IFriendship { 
    
    const friendship: IFriendship = {
      user_id: arg1,
      friend_id: arg2,
    };
  
    if (arg3) {
      friendship.friendship_status = arg3;
    }
  
    return friendship;
  }
  getNotification (arg1 :number, arg2 :number, arg3? :string) :INotification { 
    
    const notification: INotification = {
      from_id: arg1,
      to_id: arg2,
    };
  
    if (arg3) {
      notification.type = arg3;
    }
  
    return notification;
  }


}
