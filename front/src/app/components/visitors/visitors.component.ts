import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JWT_TOKEN } from '../../utils/constants';
import { SocketService } from 'src/app/utils/socket/socket.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

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
    private authService: AuthService,
  ) { }

  private apiUrlAuth :string = environment.apiUrl + "/api/auth/login/42/";
  public firstLogin :boolean = false;

  public isTwoFaEnabled :boolean = false;
  private  loggedInUserId:number = -1;

  private subscriptions: Subscription[] = [];


  ngOnInit(): void {
    this.firstLogin = JSON.parse(this.route.snapshot.queryParamMap.get('first_login')!);
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    if (accessToken) 
      localStorage.setItem(JWT_TOKEN, accessToken);
      
    this.loggedInUserId =  this.authService.getLoggedInUserId()
    
    if (this.firstLogin == false)
    {
      const subscription = this.authService.checkTwofa(this.loggedInUserId).subscribe({
        next: response => {
         
          if (response.is_tfa_enabled)
            this.router.navigate(["/login/twofa"]);
          else
          {
            this.socketService.initSocketConnection();
            this.router.navigate(["/home"]);
          }

        },
        error: error => {
          console.error('Error:', error.error.message); 
        }
      });
      this.subscriptions.push(subscription);
    }

  }

  redirectToLogin() {
    window.location.href = this.apiUrlAuth;
  }

  ngOnDestroy(): void {
    
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
