import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { INotifyData } from 'src/app/utils/interfaces/notify-data.interface';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
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
    private chatService: ChatService,
  ) {
    this.userId = this.authServece.getLoggedInUserId();

    chatService.sendToGetChatNotif(this.userId, false);
    chatService.getChatNotif().subscribe(data=> {
      chatService.chatNotifSource.next(data.num)
    })
  }
  
  public userId: number
  public searchQuery: string = '';
  public searchResults: IUserDataShort[] = [];
  public activeIndex: number = -1;
  public isNotifClicked: boolean = false;
  public isNewNotif: number = 0;
  public chatNotif: number = 0;
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

    // FOR PRIVATE MESSAE
    let messages:{id:number}[] = [];
    const subs1:Subscription = this.chatService.getNewMessage().subscribe(msg=> {
      if (msg.senderId !== this.userId) {
        messages = messages.filter(item=> item.id !== msg.senderId)
        let id = {id:msg.senderId!}
        messages.push(id)
        this.chatService.chatNotifSource.next(messages.length)
      }
    })
    this.subscriptions.push(subs1)
    const subs2:Subscription = this.chatService.chatNotif$.subscribe(data=>this.chatNotif = data)
    this.subscriptions.push(subs2)

    // FOR ROOM MESSAGE
    const subs3:Subscription = this.chatService.getRoomMessage().subscribe(msg=> {
      if (msg.senderId !== this.userId) {
        messages = messages.filter(item=> item.id !== msg.senderId)
        let id = {id:msg.senderId!}
        messages.push(id)
        this.chatService.chatNotifSource.next(messages.length)
      }
    })
    this.subscriptions.push(subs3)
    const subs4:Subscription = this.chatService.chatNotif$.subscribe(data=>this.chatNotif = data)
    this.subscriptions.push(subs4)
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

  onClickChat() {
    this.chatService.chatNotifSource.next(0)
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

  getNotifications() {
    const userId :number = this.authServece.getLoggedInUserId()
    const subscription = this.menuBarService.getNotifications(userId).subscribe({
      next: response => {
        this.notifyData = response;

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
    const subscription = this.menuBarService.deleteNotifications(notifications).subscribe({
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
    this.subscriptions.push(subscription);
  }
  
  updateSeenNotifications(notifications :number[]) {
    const subscription = this.menuBarService.updateSeenNotifications(notifications).subscribe({
      next: response => {

      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    this.subscriptions.push(subscription);
  }



  ngOnDestroy(): void {
    
    this.socket.off('notifyFriendRequest');
    this.socket.off('unNotifyFriendRequest');

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }




}

