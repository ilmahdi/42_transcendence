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
    this.userService.addFriend({
      user_id: this.authService.getLoggedInUserId(), 
      friend_id: this.userData.id
    }).subscribe({
      next: response => {
        this.friendshipStatus = response.friendship_status;
        this.friendshipId = response.id;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
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

  checkFriendshipStatus(): void {
    if (!this.isOwnProfile) {
      this.userService.checkFriendship({
        user_id: this.authService.getLoggedInUserId(), 
        friend_id: this.userData.id
      }).subscribe({
        next: response => {
          console.log(response.friendship_status)
          this.friendshipStatus = "NONE";
          this.friendshipId = response.id;
        },
        error: error => {
          console.error('Error checking friendship:', error.error.message);
        }
      });
    }
  }
  
}
