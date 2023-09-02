import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { UserService } from 'src/app/services/user.service';
import { IFriendship } from 'src/app/utils/interfaces/friendship.interface';
import { INotification } from 'src/app/utils/interfaces/notify-data.interface';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

@Component({
  selector: 'app-profile-id',
  templateUrl: './profile-id.component.html',
  styleUrls: ['./profile-id.component.css'],
})
export class ProfileIdComponent implements OnChanges {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private menuBarService: MenuBarService,
    private socket: CustomSocket,
  ) { }


  public isOwnProfile: boolean = true;
  public isMoreClicked: boolean = false;
  public friendshipStatus: string = "NONE";
  public friendshipId: number = -1;
  public isRequestInitiator :boolean = true;
  public loggedInUserId :number = this.authService.getLoggedInUserId();

  private subscriptions: Subscription[] = [];
  

  @Input() userData: IUserData = {
    id:0,
    username: '',
    avatar: '',
    wins: 0,
    losses: 0,
    draws: 0,
    games: 0,
    rating: 0,
  };
  @Input() isUserDataRecieved :boolean = false

  public connection :string = "offline";
  public showTooltip :boolean = false;

  onShowTooltip() {
    this.showTooltip = true;
  }

  hideTooltip() {
    this.showTooltip = false;
  }

  ngOnInit(): void {
    const subscription = this.route.params.subscribe(params => {
      this.isOwnProfile = params['username'] === this.authService.getLoggedInUser();
    });
    this.subscriptions.push(subscription);

    this.socket.on('refreshUser', () => {  
      this.checkFriendshipStatus(this.getFriendship(this.loggedInUserId, this.userData.id));
    });
    this.socket.on('online', () => {  
      this.connection = "online";
    });
  }


  ngOnChanges(changes :any): void {
    if (!this.isOwnProfile)
    {
      
      if (changes.userData && changes.userData.currentValue) {
        
        this.checkFriendshipStatus(this.getFriendship(this.loggedInUserId, this.userData.id));
        
        this.menuBarService.sendEvent("connection", this.userData.id)
      }
    }
    else
      this.menuBarService.sendEvent("connection", this.loggedInUserId)
      
  }


  onMoreClick(){
    this.isMoreClicked = !this.isMoreClicked;
  }
  
  onClickedOutside(): void {
    this.isMoreClicked = false
  }

  async onAddClick() {

    await this.addFriend(this.getFriendship(this.loggedInUserId, this.userData.id, "WAITING"));
    await this.addNotification(this.getNotification(this.loggedInUserId, this.userData.id, this.friendshipId, 'FRIEND_REQUEST'));

    this.menuBarService.sendEvent("notifyFriendRequest", this.userData.id)

    this.menuBarService.sendEvent("refreshUser", this.userData.id)
  }

  async onCancelClick() {

    await this.deleteFriendshipNotification(this.getNotification(this.loggedInUserId, this.userData.id, this.friendshipId));
    await this.cancelFriend(this.friendshipId)

    this.menuBarService.sendEvent("unNotifyFriendRequest", this.isRequestInitiator ? this.userData.id : this.loggedInUserId)

    this.menuBarService.sendEvent("refreshUser", this.userData.id)
  }
  async onAcceptClick() {

    await this.changeFriendshipStatus(this.friendshipId, "ACCEPTED")
    await this.updateNotification(this.getNotification(this.loggedInUserId, this.userData.id, this.friendshipId, 'FRIEND_ACCEPTE'));


    this.menuBarService.sendEvent("notifyFriendRequest", this.userData.id)
    this.menuBarService.sendEvent("unNotifyFriendRequest", this.loggedInUserId)

    this.menuBarService.sendEvent("refreshUser", this.userData.id)
  }

  async handleUnfriendClick() {

    await this.removeFriend(this.friendshipId)

    this.menuBarService.sendEvent("refreshUser", this.userData.id)
  }

  async handleBlockClick() {

    if (this.friendshipId < 0)
      await this.addFriend(this.getFriendship(this.loggedInUserId, this.userData.id, "BLOCKED"));
    
    else {
      await this.blockFriend(this.friendshipId, this.getFriendship(this.loggedInUserId, this.userData.id, "BLOCKED"))
      if (this.friendshipStatus == 'WAITING')
        await this.deleteFriendshipNotification(this.getNotification(this.loggedInUserId, this.userData.id, this.friendshipId));
      
      
      this.menuBarService.sendEvent("unNotifyFriendRequest", this.userData.id)
      this.menuBarService.sendEvent("unNotifyFriendRequest", this.loggedInUserId)
    }
    this.menuBarService.sendEvent("refreshUser", this.userData.id)
  }

  async onUnblockClick() {
      await this.unbBlockFriend(this.friendshipId)
      this.menuBarService.sendEvent("refreshUser", this.userData.id)
  }
  
  
  
  
  
  
  
  
  // private functions
  /******************************************************************** */
  async checkFriendshipStatus(friendship :IFriendship) {

    try {
      const response = await firstValueFrom(this.userService.checkFriendship(friendship));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async addFriend(friendship :IFriendship) {

    try {
      const response = await firstValueFrom(this.userService.addFriend(friendship));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async changeFriendshipStatus (friendshipId :number,friendshipStatus :string) {

    try {
      const response = await firstValueFrom(this.userService.changeFriendshipStatus(friendshipId, friendshipStatus));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async cancelFriend (friendshipId :number) {

    try {
      const response = await firstValueFrom(this.userService.cancelFriend(friendshipId));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async removeFriend(friendshipId :number) {

    try {
      const response = await firstValueFrom(this.userService.cancelFriend(friendshipId));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async blockFriend(friendshipId :number, friendship :IFriendship) {

    try {
      const response = await firstValueFrom(this.userService.updateFriend(friendshipId, friendship));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async unbBlockFriend(friendshipId :number) {

    try {
      const response = await firstValueFrom(this.userService.cancelFriend(friendshipId));
  
      this.updateFriendshipSwitches(response);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }








  /******************************************************************** */
  async addNotification(notification :INotification) {

    try {
      await firstValueFrom(this.menuBarService.addNotification(notification));
      
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




  ngOnDestroy(): void {

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
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
  getNotification (arg1 :number, arg2 :number, arg3? :number, arg4? :string) :INotification { 
    
    const notification: INotification = {
      from_id: arg1,
      to_id: arg2,
    };
  
    if (arg3) {
      notification.friendship_id = arg3;
    }
    if (arg4) {
      notification.type = arg4;
    }
  
    return notification;
  }
  updateFriendshipSwitches (response :any) {

    this.friendshipStatus = response.friendship_status;
    this.friendshipId = response.id;
    response.user_id
      this.isRequestInitiator = this.loggedInUserId === response.user_id;
  }
 
  
}
