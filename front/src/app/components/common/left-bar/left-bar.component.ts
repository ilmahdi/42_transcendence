import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { SocketService } from 'src/app/utils/socket/socket.service';


@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private confirmService: ConfirmService,
    private socketService: SocketService,
  ) { }
  
  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  sub!: Subscription;
  
  public get username(): string {
    return this.authService.getLoggedInUser();
  }


  ngOnInit(): void {
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
