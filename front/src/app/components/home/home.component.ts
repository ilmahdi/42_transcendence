import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUserData } from '../../utils/interfaces/user-data.interface';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { CustomizeGameComponent } from '../modals/customize-game/customize-game.component';
import { Subscription, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';
import { GameInviteComponent } from '../modals/game-invite/game-invite.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    public loadingService: LoadingService,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private gameService : GameService,
    private socket: CustomSocket,
  ) { 

  }
  public isLoading: boolean = true;
  public userData: IUserData = { 
    id:0,
    username: '',
    avatar: '',
    wins: 0,
    losses: 0,
    draws: 0,
    games: 0,
    rating: 0,
  };

  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  sub!: Subscription;

  ngOnInit(): void {
    
    this.socket.emit("leaveMatchmaking", this.authService.getLoggedInUserId());

    this.loadingService.showLoading();
    this.getUserData();

    this.socket.on('opponentId', (opponent :{userId :number, isToStart :boolean}) => {
      
      this.gameService.playerId2 = opponent.userId; 
      this.gameService.isToStart = opponent.isToStart; 
      
      this.gameService.setInGameMode(true);
      this.router.navigate(['/game']);
      this.loadingService.hideLoading();

    });
  }
  getUserData() {
     this.userService.getUserData().subscribe((data: IUserData) => {
       this.userData = data;
       
       this.loadingService.hideLoading();

    });

  }

  async openConfirmModal(isNormalPlay :boolean) {


    try {
      const mapId = await firstValueFrom(this.confirmService.open(this.entry, CustomizeGameComponent));
      
      this.gameService.mapIndex = +mapId;
      this.gameService.playerId1 = this.authService.getLoggedInUserId();
      
      if (isNormalPlay) {
        
        this.loadingService.showLoading();
        this.socket.emit("requestOpponentId", this.gameService.playerId1);
      }
      else {
        this.openGameInviteModal();
      }
    }
    catch {

    }
  
  }

  openGameInviteModal() {
    this.sub = this.confirmService
      .open(this.entry, GameInviteComponent, "Enter a username")
      .subscribe((userId :any) => {

        this.gameService.isToStart = false;
        this.gameService.playerId2 = userId;
        this.gameService.setInGameMode(true);
        this.router.navigate(['/game']);
      });
  }

  ngOnDestroy(): void {
  }

}
