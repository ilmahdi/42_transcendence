import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    public loadingService: LoadingService,
    private authService :AuthService,
    ) { }

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.getUserData();
  }
  public isClicked :boolean = true;
  public userData: IUserData = {
    id:0,
    username: '',
    avatar: '',
    wins: 0,
    losses: 0,
    draws: 0,
    games: 0,
    rating: 0,
  };
  private subscriptions: Subscription[] = [];

  toggleActive() {
    this.isClicked = !this.isClicked;
  }
  getUserData() {
    const subscription = this.route.params.subscribe(params => {

      const subscription = this.userService.getUserDataByUsername(params['username']).subscribe({
          next: (response :IUserData) => {
          
            this.userData = response;
            this.loadingService.hideLoading()
          },
          error: error => {
            this.loadingService.hideLoading();
            this.authService.setAuthenticated(false)
            this.router.navigate(["/not-found"]);
          }
      });
     this.subscriptions.push(subscription);
    });
    this.subscriptions.push(subscription);
  }




  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
