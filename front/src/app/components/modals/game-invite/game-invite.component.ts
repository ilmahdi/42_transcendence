import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { INotifyData } from 'src/app/utils/interfaces/notify-data.interface';
import { CustomSocket } from 'src/app/utils/socket/socket.module';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';



@Component({
  selector: 'app-game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.css']
})
export class GameInviteComponent {
  constructor(
    private authService :AuthService,
    public menuBarService: MenuBarService,
    public authServece: AuthService,
    private socket: CustomSocket,
    ) {

    this.loggedInUserId  = this.authService.getLoggedInUserId();
  }

  private loggedInUserId :number;
  
  public invitedUserId :number = 0;
  public activeIndex: number = -1;
  public searchQuery: string = '';
  public searchResults: IUserDataShort[] = [];

  private subscriptions: Subscription[] = [];

  @Input() title: string = '';
  @Input() body: string = '';
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  ngOnInit(): void {
    this.socket.on('successGameInvite', () => {
      this.confirmEvent.emit(this.invitedUserId);
    });
    this.socket.on('waitInviteOpponentId', (userId :number) => {
      this.invitedUserId = userId;
    });
    this.socket.on('failInviteOpponentId', () => {
      this.invitedUserId = 0;
      this.searchQuery = '';
      this. searchResults = [];    
    });
    this.socket.on('cancelGameInvite', () => {
      this.invitedUserId = 0;
      this.searchQuery = '';
      this. searchResults = [];    
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {

    console.log("before leaaaa")
    this.socket.emit("cancelGameInvite", this.loggedInUserId);
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

        this.searchQuery =this.searchResults[this.activeIndex].username!;
        this.inviteUser(this.searchResults[this.activeIndex].id!);
      }
      else {
        this.onClickedOutside1()
      }
    }
  }
  onUserClick(index :number) {

    if (index >= 0 && index < this.searchResults.length) {
      if (this.searchResults[index].id !== this.loggedInUserId) {
        
        this.activeIndex = index;
        this.searchQuery =this.searchResults[index].username!;
        this.inviteUser(this.searchResults[index].id!);
      }
      else {
        this.onClickedOutside1()
      }
    }
  }

  onClickedOutside1(): void {
    this.socket.emit("cancelGameInvite", this.loggedInUserId);
    this.searchQuery = '';
    this. searchResults = [];    
  }



  // private functions
  searchUsers() {
    this.menuBarService.searchUsers(this.searchQuery).subscribe({
      next: response => {
        this.searchResults = response;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });

  }
  inviteUser(invitedUserId :number) {

    this.socket.emit("inviteOpponentId", {
      player1Id: this.loggedInUserId,
      player2Id: invitedUserId,
    });
  }



  closeMe() {
    this.socket.emit("cancelGameInvite", this.loggedInUserId);
    this.closeMeEvent.emit();
  }

  ngOnDestroy(): void {
  }

}
