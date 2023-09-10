import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
    private userService: UserService,
    private route: ActivatedRoute,
    public loadingService: LoadingService,
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

      const subscription = this.userService.getUserDataByUsername(params['username']).subscribe((data: IUserData) => {
        this.userData = data;

       this.loadingService.hideLoading()
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
