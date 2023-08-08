import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../environments/environment';
import { JWT_TOKEN } from '../../utils/constants';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    ) { }

    private apiUrlAuth = environment.apiUrlAuth;

  ngOnInit(): void {
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    if (accessToken) {
      localStorage.setItem(JWT_TOKEN, accessToken);
      this.router.navigate(["/home"])
    }
  }

  redirectToLogin() {
    window.location.href = this.apiUrlAuth;
  }

}
