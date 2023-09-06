import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

@Component({
  selector: 'app-online-friends',
  templateUrl: './online-friends.component.html',
  styleUrls: ['./online-friends.component.css']
})
export class OnlineFriendsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private socket: CustomSocket,
  ) { }

  public friendList: IUserDataShort[] = [];
  public userData: IUserDataShort = { 
    id:0,
    username: '',
    avatar: '',
  };

  public connectedFriendsById: { [userId: number]: boolean } = {}; 
  public connectedFriendsIds: number[] = [];

  ngOnInit(): void {
    this.getUserData()

    this.socket.on('online', (userId :number) => {
    
      this.connectedFriendsById[userId] = true
      console.log("online",this.connectedFriendsById)
    });
    this.socket.on('offline', (userId :number) => {
      
      this.connectedFriendsById[userId] = false
      console.log("offline",this.connectedFriendsById)
    });
  }

  getUserData() {
     this.userService.getUserDataShort().subscribe({
      next: (response :IUserDataShort) => {
       
        this.userData = response;
        this.getfriendList();
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }
  getfriendList() {
     this.userService.getfriendList(this.userData.id!).subscribe({
      next: (response :IUserDataShort[]) => {
       
        this.friendList = response;

        for (const user of this.friendList) {
          if (user.id) {

            this.connectedFriendsById[user.id] = true;
            this.connectedFriendsIds.push(user.id);
          }
        }
        this.socket.emit("connectionStatusMany", this.connectedFriendsIds)
        this.socket.emit("watchConnectionMany", this.connectedFriendsIds)
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }


}
