import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { INotifyData } from 'src/app/utils/interfaces/notify-data.interface';

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
  ) {
  }
  
  public searchQuery: string = '';
  public searchResults: any[] = [];
  public activeIndex: number = -1;
  public isNotifClicked: boolean = false;
  public isNewNotif: boolean = false;
  public notifyData :INotifyData[] = []
  
  ngOnInit(): void {
    const userId :number = this.authServece.getLoggedInUserId()
    this.menuBarService.getNotifications(userId).subscribe({
      next: response => {
        this.notifyData = response;
        console.log(this.notifyData);
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
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
    this.menuBarService.sendEvent("hello")
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



}

