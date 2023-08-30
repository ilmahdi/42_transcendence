import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JWT_TOKEN } from '../../utils/constants';
import { SocketService } from 'src/app/utils/socket/socket.service';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
  ) { }

  private apiUrlAuth :string = environment.apiUrlAuth;
  public firstLogin :boolean = false;


  ngOnInit(): void {
    this.firstLogin = JSON.parse(this.route.snapshot.queryParamMap.get('first_login')!);
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    if (accessToken) 
      localStorage.setItem(JWT_TOKEN, accessToken);
    
    if (!this.firstLogin)
      this.router.navigate(["/home"]);
      this.socketService.initSocketConnection();
  }

  redirectToLogin() {
    window.location.href = this.apiUrlAuth;
  }
}
