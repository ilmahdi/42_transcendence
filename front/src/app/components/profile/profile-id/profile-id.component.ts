import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

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
  ) { }

  public isOwnProfile: boolean = true;
  public isMoreClicked: boolean = false;
  public friendshipStatus: string = "NONE";
  public friendshipId: number = -1;
  public isRequestInitiator :boolean = true;

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

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.isOwnProfile = params['username'] === this.authService.getLoggedInUser();
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
    if (this.friendshipId < 0)
      return
    this.userService.cancelFriend(this.friendshipId).subscribe({
      next: response => {
        
        this.friendshipStatus = "NONE";
        this.friendshipId = -1;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }
  onAcceptClick() {
    this.changeFriendshipStatus("ACCEPTED")
  }

  checkFriendshipStatus(): void {
    if (!this.isOwnProfile) {
      this.userService.checkFriendship({
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
    }
  }

  handleUnfriendClick() {
    this.userService.cancelFriend(this.friendshipId).subscribe({
      next: response => {
        this.friendshipStatus = "NONE"
        this.friendshipId = -1;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }

  handleBlockClick() {
    if (this.friendshipId < 0) {
      this.addFriend("BLOCKED")
    }
    
    else {
      this.userService.updateFriend(this.friendshipId, {
        user_id: this.authService.getLoggedInUserId(), 
        friend_id: this.userData.id,
        friendship_status: "BLOCKED",
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
    }
  }

  onUnblockClick() {
    if (this.friendshipId < 0) {

    }
    this.userService.cancelFriend(this.friendshipId).subscribe({
      next: response => {
        this.friendshipStatus = "NONE";
        this.friendshipId = -1;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }








  // private functions
  addFriend(friendshipStatus :string) {
    this.userService.addFriend({
      user_id: this.authService.getLoggedInUserId(), 
      friend_id: this.userData.id,
      friendship_status: friendshipStatus,
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
  }

  changeFriendshipStatus (friendshipStatus :string) {
    if (this.friendshipId < 0)
      return
    this.userService.changeFriendshipStatus(this.friendshipId, friendshipStatus).subscribe({
      next: response => {
        
        this.friendshipStatus = response.friendship_status;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }
  
}
