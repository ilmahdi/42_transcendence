import { Component, EventEmitter, HostListener, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { AlertComponent } from '../alert/alert.component';



@Component({
  selector: 'app-game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.css']
})
export class GameInviteComponent {
  constructor(
    private authService :AuthService,
    public menuBarService: MenuBarService,
    private socket: CustomSocket,
    private gameService : GameService,
    private userService: UserService,
  ) {

    this.loggedInUserId  = this.authService.getLoggedInUserId();
    this.invitedUserId = this.gameService.playerId2;
  }

  private confirmService = new ConfirmService();

  private loggedInUserId :number;
  
  public invitedUserId :number;
  public activeIndex: number = -1;
  public searchQuery: string = '';
  public searchResults: IUserDataShort[] = [];
  public userData : IUserDataShort = {
    id: 0,
    username: "",
    avatar: ""
  }

  @ViewChild('alertModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  private subscriptions: Subscription[] = [];

  @Input() title: string = '';
  @Input() body: string = '';
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  @ViewChild('alertModal', { read: ViewContainerRef })
  entry2!: ViewContainerRef;

  ngOnInit(): void {
    if (this.gameService.playerId2)
      this.getUserData()

    this.socket.on('successGameInvite', () => {
      this.confirmEvent.emit(this.invitedUserId);
    });
    this.socket.on('waitInviteOpponentId', (userId :number) => {
      this.invitedUserId = userId;
    });
    this.socket.on('failInviteOpponentId', () => {
      if (!this.title) {

        this.confirmEvent.emit(-2);
      }
      else {

        this.confirmService
        .open(this.entry, AlertComponent, "ERROR", "User is already in a game")
      }
      this.invitedUserId = 0;
      this.searchQuery = '';
      this. searchResults = [];

    });
    this.socket.on('cancelGameInvite', () => {
      if (!this.title) {

        this.confirmEvent.emit(-1);
      }
      else {

        this.confirmService
        .open(this.entry, AlertComponent, "ERROR", "Game Request Rejected")
      }
      this.invitedUserId = 0;
      this.searchQuery = '';
      this. searchResults = [];    
    });
  }

  getUserData() {
    const subscription = this.userService.getUserDataShort2(this.gameService.playerId2).subscribe({
      next: (response :IUserDataShort) => {
       
        this.userData = response;
        this.inviteUser(this.gameService.playerId2);
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {

    this.socket.emit("cancelGameInvite", {player1Id:this.loggedInUserId, player2Id: this.invitedUserId});
  }

  onSearchInputChange() {
    if (this.searchQuery.length > 2) {
      this.activeIndex = -1;
      this.searchUsers();
    } else {
      this.searchResults = [];
    }
  }

  onSearchInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      event.preventDefault();
    if (event.key === 'ArrowDown') {
      if (this.activeIndex < this.searchResults.length - 1)
      this.activeIndex++;
      else
      this.activeIndex = 0;
    }
    else if (event.key === 'ArrowUp') {
      if (this.activeIndex > 0)
        this.activeIndex--;
      else
        this.activeIndex = this.searchResults.length - 1;
    }
    
  }

  onUserItemEnter(event: Event) {
    event.preventDefault();
    if (this.activeIndex >= 0 && this.activeIndex < this.searchResults.length) {
      if (this.searchResults[this.activeIndex].id !== this.loggedInUserId) {

        this.userData.id = this.searchResults[this.activeIndex].id!
        this.userData.username = this.searchResults[this.activeIndex].username!
        this.userData.avatar = this.searchResults[this.activeIndex].avatar!

        this.inviteUser(this.userData.id);
      }
      else {
        this.onClickedOutside1()
      }
    }
  }
  onUserClick(index :number) {

    if (index >= 0 && index < this.searchResults.length) {
      if (this.searchResults[index].id !== this.loggedInUserId) {

        this.userData.id = this.searchResults[index].id!
        this.userData.username = this.searchResults[index].username!
        this.userData.avatar = this.searchResults[index].avatar!

        this.inviteUser(this.userData.id);
      }
      else {
        this.onClickedOutside1()
      }
    }
  }

  onClickedOutside1(): void {
    this.socket.emit("cancelGameInvite", {player1Id:this.loggedInUserId, player2Id: this.invitedUserId});
    this.searchQuery = '';
    this. searchResults = [];    
  }



  // private functions
  searchUsers() {
    const subscription = this.menuBarService.searchUsers(this.searchQuery).subscribe({
      next: response => {
        this.searchResults = response;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);

  }
  inviteUser(invitedUserId :number) {

    this.socket.emit("inviteOpponentId", {
      player1Id: this.loggedInUserId,
      player2Id: invitedUserId,
    });
  }


  closeMe() {
    this.socket.emit("cancelGameInvite", {player1Id:this.loggedInUserId, player2Id: this.invitedUserId});
    this.closeMeEvent.emit();
  }

  ngOnDestroy(): void {
    this.socket.off('successGameInvite');
    this.socket.off('waitInviteOpponentId');
    this.socket.off('failInviteOpponentId');
    this.socket.off('cancelGameInvite');
    
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
