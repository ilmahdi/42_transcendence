import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    ) {
      this.loggedInUserId  = this.authService.getLoggedInUserId();
    }
  

  public loggedInUserId :number;
  public friendList: IUserDataShort[] = [];

  ngOnInit(): void {
    this.getfriendList()
  }
    


  getfriendList() {
    this.userService.getfriendList(this.loggedInUserId).subscribe({
     next: (response :IUserDataShort[]) => {
       this.friendList = response;
     },
     error: error => {
       console.error('Error:', error.error.message); 
     }
   });
 }


}
