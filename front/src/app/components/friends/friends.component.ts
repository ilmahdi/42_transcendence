import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { CustomizeGameComponent } from '../modals/customize-game/customize-game.component';
import { GameService } from 'src/app/services/game.service';
import { GameInviteComponent } from '../modals/game-invite/game-invite.component';
import { Router } from '@angular/router';
import { AlertComponent } from '../modals/alert/alert.component';

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

  private subscriptions: Subscription[] = [];

  private confirmService2 = new ConfirmService();

  ngOnInit(): void {
    this.getfriendList()
  }
    


  getfriendList() {
    const subscription = this.userService.getfriendList(this.loggedInUserId).subscribe({
     next: (response :IUserDataShort[]) => {
       this.friendList = response;
     },
     error: error => {
       console.error('Error:', error.error.message); 
     }
   });
   this.subscriptions.push(subscription);
  }

  async handlePlayClick(index :number) {

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
      .subscribe((userId :any) => {
        if (userId < 0) {
          if (userId == -1) {
            this.confirmService2
            .open(this.entry, AlertComponent, "ERROR", "Game Request Rejected")
          }
          else if (userId == -2) {
            this.confirmService2
            .open(this.entry, AlertComponent, "ERROR", "User is already in a game")

          }
        }
        else {

          this.gameService.isToStart = false;
          this.gameService.setInGameMode(true);
          this.router.navigate(['/game']);
        }
      });
  }

  ngOnDestroy(): void {
    
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }


}
