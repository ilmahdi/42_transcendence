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

  private subscriptions: Subscription[] = [];

  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  ngOnInit(): void {
    
    this.socket.emit("leaveMatchmaking", this.authService.getLoggedInUserId());

    this.loadingService.showLoading();
    this.getUserData();

    this.socket.on('opponentId', (opponent :{userId :number, isToStart :boolean}) => {
      
      this.gameService.playerId2 = opponent.userId; 
      this.gameService.isToStart = opponent.isToStart; 
      this.gameService.isOnePlayer = false;
      
      this.gameService.setInGameMode(true);
      this.router.navigate(['/game']);
      this.loadingService.hideLoading();

    });

    this.socket.on('failRequestOpponentId', () => {

      this.loadingService.hideLoading();
    });
  }
  getUserData() {
    const subscription = this.userService.getUserData().subscribe({
      next: (response :IUserData) => {
       
        this.userData = response;

        this.loadingService.hideLoading();
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);

  }

  async openConfirmModal(playMode :string) {

    try {
      const mapId = await firstValueFrom(this.confirmService.open(this.entry, CustomizeGameComponent));
      
      this.gameService.mapIndex = +mapId;
      this.gameService.playerId1 = this.authService.getLoggedInUserId();
      this.gameService.playerId2 = 0;
      
      if (playMode === 'NORMAL') {
        
        this.loadingService.showLoading();
        this.socket.emit("requestOpponentId", this.gameService.playerId1);
      }
      else if (playMode === 'INVITE') {
        this.openGameInviteModal();
      }
      else if (playMode === 'COMPUTER') {

        this.gameService.setInGameMode(true);
        this.gameService.isOnePlayer = true;
        this.gameService.isToStart = true;
        this.router.navigate(['/game']);
      }
      
    }
    catch {

    }
  
  }

  openGameInviteModal() {
    const subscription = this.confirmService
      .open(this.entry, GameInviteComponent, "Enter a username")
      .subscribe((userId :any) => {
        
        this.gameService.isToStart = false;
        this.gameService.playerId2 = userId;
        this.gameService.setInGameMode(true);
        this.router.navigate(['/game']);
      });
      this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    
    this.socket.off('opponentId');
    this.socket.off('failRequestOpponentId');

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
