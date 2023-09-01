import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { UserService } from 'src/app/services/user.service';
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

  ngOnInit(): void {
    const subscription = this.route.params.subscribe(params => {
      this.isOwnProfile = params['username'] === this.authService.getLoggedInUser();
    });
    this.subscriptions.push(subscription);

    this.socket.on('refreshUser', () => {  this.checkFriendshipStatus();
    });
  }


  ngOnChanges(changes :any): void {
    if (changes.userData && changes.userData.currentValue)
      this.checkFriendshipStatus();
  }


  onMoreClick(){
    this.isMoreClicked = !this.isMoreClicked;
  }
  
  onClickedOutside(): void {
    this.isMoreClicked = false
  }

  onAddClick() {
    this.addFriend("WAITING")
  }

  onCancelClick() {
    if (this.friendshipId > 0)
      this.cancelFriend()
  }
  onAcceptClick() {
    this.changeFriendshipStatus("ACCEPTED")
  }

  handleUnfriendClick() {
    this.removeFriend()
  }

  handleBlockClick() {
    if (this.friendshipId < 0) 
      this.addFriend("BLOCKED")
    
    else 
      this.blockFriend()
  }

  onUnblockClick() {
    if (this.friendshipId > 0)
      this.unbBlockFriend()
  }
  
  
  
  
  
  
  
  
  // private functions
  /******************************************************************** */
  checkFriendshipStatus(): void {
    if (!this.isOwnProfile) {
      const subscription = this.userService.checkFriendship({
        user_id: this.authService.getLoggedInUserId(), 
        friend_id: this.userData.id,
      }).subscribe({
        next: response => {
          
          this.friendshipStatus = response.friendship_status;
          this.friendshipId = response.id;
          this.isRequestInitiator = this.authService.getLoggedInUserId() === response.user_id;
        },
        error: error => {
          console.error('Error:', error.error.message);
        }
      });
      this.subscriptions.push(subscription);
    }
  }
  addFriend(friendshipStatus :string) {

    const subscription = this.userService.addFriend({
      user_id: this.authService.getLoggedInUserId(), 
      friend_id: this.userData.id,
      friendship_status: friendshipStatus,
    }).subscribe({
      next: response => {

        this.friendshipStatus = response.friendship_status;
        this.friendshipId = response.id;
        this.isRequestInitiator = this.authService.getLoggedInUserId() === response.user_id;
        if (friendshipStatus === 'WAITING') {
          this.addNotification({
            from_id: this.authService.getLoggedInUserId(), 
            to_id: this.userData.id,
            type: 'FRIEND_REQUEST',
          })
        }
        this.menuBarService.sendEvent("refreshUser", this.userData.id)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }

  changeFriendshipStatus (friendshipStatus :string) {
    if (this.friendshipId < 0)
      return
      const subscription = this.userService.changeFriendshipStatus(this.friendshipId, friendshipStatus).subscribe({
      next: response => {
        
        this.friendshipStatus = response.friendship_status;
        this.switchNotification({
          from_id: this.authService.getLoggedInUserId(), 
          to_id: this.userData.id,
          type: 'FRIEND_ACCEPTE',
        });
        this.menuBarService.sendEvent("refreshUser", this.userData.id)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }
  cancelFriend () {
    const subscription = this.userService.cancelFriend(this.friendshipId).subscribe({
      next: response => {
        
        this.friendshipStatus = "NONE";
        this.friendshipId = -1;
        this.deleteNotification({
          from_id: this.isRequestInitiator ? this.authService.getLoggedInUserId() : this.userData.id, 
          to_id: this.isRequestInitiator ? this.userData.id : this.authService.getLoggedInUserId(),
        });
        this.menuBarService.sendEvent("refreshUser", this.userData.id)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }
  removeFriend() {
    const subscription = this.userService.cancelFriend(this.friendshipId).subscribe({
      next: response => {
        this.friendshipStatus = "NONE"
        this.friendshipId = -1;
        this.menuBarService.sendEvent("refreshUser", this.userData.id)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }
  blockFriend() {
    const subscription = this.userService.updateFriend(this.friendshipId, {
      user_id: this.authService.getLoggedInUserId(), 
      friend_id: this.userData.id,
      friendship_status: "BLOCKED",
    }).subscribe({
      next: response => {

        this.friendshipStatus = response.friendship_status;
        this.friendshipId = response.id;
        this.deleteNotification({
          from_id: (this.isRequestInitiator && this.friendshipStatus !== 'WAITING') ? this.authService.getLoggedInUserId() : this.userData.id, 
          to_id: (this.isRequestInitiator && this.friendshipStatus !== 'WAITING') ? this.userData.id : this.authService.getLoggedInUserId(),
        });
        this.isRequestInitiator = this.authService.getLoggedInUserId() === response.user_id;
        this.menuBarService.sendEvent("refreshUser", this.userData.id)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }
  unbBlockFriend() {
    const subscription = this.userService.cancelFriend(this.friendshipId).subscribe({
      next: response => {
        this.friendshipStatus = "NONE";
        this.friendshipId = -1;
        this.menuBarService.sendEvent("refreshUser", this.userData.id)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }

  /******************************************************************** */
  addNotification(notification :INotification) {
    const subscription = this.menuBarService.addNotification(notification).subscribe({
      next: response => {

        this.menuBarService.sendEvent("notifyFriendRequest", this.userData.id)

      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
    
  }
  switchNotification(notification :INotification) {
    const subscription = this.menuBarService.switchNotification(notification).subscribe({
      next: response => {

        this.menuBarService.sendEvent("notifyFriendRequest", this.userData.id)
        this.menuBarService.sendEvent("unNotifyFriendRequest", this.authService.getLoggedInUserId())
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }
  deleteNotification(notification :INotification) {
    const subscription = this.menuBarService.deleteNotification(notification).subscribe({
      next: response => {

        this.menuBarService.sendEvent("unNotifyFriendRequest", this.isRequestInitiator ? this.userData.id : this.authService.getLoggedInUserId())
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
 
  
}
