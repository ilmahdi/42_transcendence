import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { CustomizeGameComponent } from '../modals/customize-game/customize-game.component';
import { GameService } from 'src/app/services/game.service';
import { GameInviteComponent } from '../modals/game-invite/game-invite.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private confirmService: ConfirmService,
    private gameService : GameService,
    private router: Router,
    ) {
      this.loggedInUserId  = this.authService.getLoggedInUserId();
    }
  

  public loggedInUserId :number;
  public friendList: IUserDataShort[] = [];


  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;


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

 async handlePlayClick(index :number) {

  console.log(index)

  try {
    const mapId = await firstValueFrom(this.confirmService.open(this.entry, CustomizeGameComponent));
    
    this.gameService.mapIndex = +mapId;
    this.gameService.playerId1 = this.authService.getLoggedInUserId();
    this.gameService.playerId2 = this.friendList[index].id!;
    
    this.openGameInviteModal();
    
  }
  catch {

  }

}
openGameInviteModal() {
  this.confirmService
    .open(this.entry, GameInviteComponent)
    .subscribe(() => {

      this.gameService.isToStart = false;
      this.gameService.setInGameMode(true);
      this.router.navigate(['/game']);
    });
}


}
