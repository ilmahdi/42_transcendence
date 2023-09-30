import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBarService } from 'src/app/services/menu-bar.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { SocketService } from 'src/app/utils/socket/socket.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';



@Component({
  selector: 'app-left-bar-second',
  templateUrl: './left-bar-second.component.html',
  styleUrls: ['./left-bar-second.component.css'],
  
})
export class LeftBarSecondComponent implements OnInit {

  constructor(
    public menuBarService: MenuBarService,
    private authService: AuthService,
    private router: Router,
    private confirmService: ConfirmService,
    private socketService: SocketService,
  ) {
  }

  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  sub!: Subscription;
  
  public get username(): string {
    return this.authService.getLoggedInUser();
  }


  ngOnInit(): void {
  }

  toggleLeftBar() {
    this.menuBarService.iShowLeftBar = false;
  }

  openConfirmModal() {
    this.sub = this.confirmService
      .open(this.entry, ConfirmComponent, 'Are you sure you want to Sign Out?', 'click confirme to continue')
      .subscribe(() => {
        this.authService.logout();

        this.socketService.endSocketConnection();
        this.router.navigate(['/login']);
      });
  }


  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
