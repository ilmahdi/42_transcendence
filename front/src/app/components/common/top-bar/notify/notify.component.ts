import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { UserService } from 'src/app/services/user.service';
import { IFriendship } from 'src/app/utils/interfaces/friendship.interface';
import { INotification, INotifyData } from 'src/app/utils/interfaces/notify-data.interface';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

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
    private socket: CustomSocket,
    private gameService : GameService,
    private router: Router,
  ) {

    this.loggedInUserId  = this.authService.getLoggedInUserId();
  }

  @Input() notifyData: INotifyData[] = [];

  @Output() buttonClickEvent :EventEmitter<void> = new EventEmitter<void>();

  public NotificationType = NotificationType;
  public loggedInUserId :number;

  ngOnInit(): void {
    
    this.socket.on('successGameInvite', () => {
      
      this.gameService.setInGameMode(true);
      this.router.navigate(['/game']);
      this.socket.off('successGameInvite');
    });
  }

  async onAcceptFriendClick(index :number) {
    
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



  async onAcceptGameClick(index :number) {

    this.buttonClickEvent.emit();
    const target_id = this.notifyData[index].notif_from.id;
    
    this.gameService.playerId1 = this.loggedInUserId; 
    this.gameService.playerId2 = target_id; 
    this.gameService.isToStart = true; 

    this.socket.emit("acceptGameInvite", {
      player1Id: this.loggedInUserId,
      player2Id: target_id,
    });
    
    await this.deleteFriendshipNotification(this.getNotification(this.loggedInUserId, target_id));
    
  }
  async onRejecttGameClick(index :number) {

    this.buttonClickEvent.emit();
    const target_id = this.notifyData[index].notif_from.id;

    this.socket.emit("cancelGameInvite", {player1Id: target_id, player2Id:this.loggedInUserId});
    
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

  ngOnDestroy(): void {
  }




}
