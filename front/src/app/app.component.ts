import { Component, HostListener, OnInit } from '@angular/core';
import { SocketService } from './utils/socket/socket.service';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor (
    private socketService: SocketService,
    private authService: AuthService,
    public loadingService: LoadingService
  ) {
  }

  public isAuthenticated :boolean = false;

  ngOnInit(): void {
    
    this.socketService.initSocketConnection();
    this.authService.isAuthenticated$.subscribe((value) => {
      this.isAuthenticated = value;
    });
  }

  

  ngOnDestroy():void {
    this.socketService.endSocketConnection();
  }
}
