import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmService } from 'src/app/services/modals/confirm.service';


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
  ) { }
  
  @ViewChild('confirmModal', { read: ViewContainerRef })
  entry!: ViewContainerRef;

  sub!: Subscription;


  ngOnInit(): void {
  }
  openModal() {
    this.sub = this.confirmService
      .open(this.entry, 'Are you sure you want to Sign Out?', 'click confirme to continue')
      .subscribe((v) => {
        this.authService.logout();
        this.router.navigate(['/login']);
      });
  }
}
