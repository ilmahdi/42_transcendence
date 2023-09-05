import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JWT_TOKEN } from '../../utils/constants';
import { SocketService } from 'src/app/utils/socket/socket.service';
import { AuthService } from 'src/app/services/auth.service';

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

  private apiUrlAuth :string = environment.apiUrlAuth;
  public firstLogin :boolean = false;

  public isTwoFaEnabled :boolean = false;
  private  loggedInUserId:number = -1;


  ngOnInit(): void {
    this.firstLogin = JSON.parse(this.route.snapshot.queryParamMap.get('first_login')!);
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    if (accessToken) 
      localStorage.setItem(JWT_TOKEN, accessToken);
      
    this.loggedInUserId =  this.authService.getLoggedInUserId()
    
    if (this.firstLogin == false)
    {
      this.authService.checkTwofa(this.loggedInUserId).subscribe({
        next: response => {
         
          if (response.is_tfa_enabled)
            this.router.navigate(["/login/twofa"]);
          else
            this.router.navigate(["/home"]);

        },
        error: error => {
          console.error('Error:', error.error.message); 
        }
      });
    }

    this.socketService.initSocketConnection();
  }

  redirectToLogin() {
    window.location.href = this.apiUrlAuth;
  }
}
