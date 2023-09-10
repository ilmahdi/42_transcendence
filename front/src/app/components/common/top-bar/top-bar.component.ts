import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { INotifyData } from 'src/app/utils/interfaces/notify-data.interface';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit {

  constructor(
    public menuBarService: MenuBarService,
    public authServece: AuthService,
    private router: Router,
    private socket: CustomSocket,
  ) {
  }
  
  public searchQuery: string = '';
  public searchResults: any[] = [];
  public activeIndex: number = -1;
  public isNotifClicked: boolean = false;
  public isNewNotif: number = 0;
  public notifyData :INotifyData[] = []


  private subscriptions: Subscription[] = [];
  
  ngOnInit(): void {
    this.socket.on('notifyFriendRequest', (data :any) => {
      this.isNewNotif += data.notify

    });
    this.socket.on('unNotifyFriendRequest', (data :any) => {
      if (this.isNewNotif)
        this.isNewNotif += data.notify

    });
    this.getNotifications();
  }

  toggleLeftBar() {
    this.menuBarService.iShowLeftBar = !this.menuBarService.iShowLeftBar;
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
      this.router.navigate(["/profile", this.searchResults[this.activeIndex].username]);
      this.onClickedOutside1()
    }
  }

  onClickedOutside1(): void {
    this.searchQuery = '';
    this. searchResults = [];    
  }
  onClickedOutside2(): void {
    this.isNotifClicked = !this.isNotifClicked;
  }
  onClickNotif(event: Event): void {
    event.stopPropagation();
    this.isNotifClicked = !this.isNotifClicked;
    this.isNewNotif = 0;
    this.getNotifications();
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

  getNotifications() {
    const userId :number = this.authServece.getLoggedInUserId()
    const subscription = this.menuBarService.getNotifications(userId).subscribe({
      next: response => {
        this.notifyData = response.slice().reverse();

        this.notifyData.forEach((notification :INotifyData) => {
          if (!notification.seen)
          {
            if (this.isNotifClicked)
              notification.seen = true;
            else
              ++this.isNewNotif;
          }
        });
        if (this.isNotifClicked)
        {
          const seenIds = this.notifyData
              .filter((notification :INotifyData) => notification.seen && notification.type == 'FRIEND_ACCEPTE')
              .map((notification :INotifyData) => notification.id);
          this.deleteNotifications(seenIds);
        }
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
      
    });
    this.subscriptions.push(subscription);

  }

  deleteNotifications(notifications :number[]) {
    this.menuBarService.deleteNotifications(notifications).subscribe({
      next: response => {
        
        const remaindIds = this.notifyData
            .filter((notification :INotifyData) => notification.type !== 'FRIEND_ACCEPTE')
            .map((notification :INotifyData) => notification.id);
        this.updateSeenNotifications(remaindIds);

      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }
  
  updateSeenNotifications(notifications :number[]) {
    this.menuBarService.updateSeenNotifications(notifications).subscribe({
      next: response => {

      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
  }


}

