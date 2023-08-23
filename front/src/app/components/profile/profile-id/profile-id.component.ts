import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-profile-id',
  templateUrl: './profile-id.component.html',
  styleUrls: ['./profile-id.component.css'],
})
export class ProfileIdComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  public isOwnProfile: boolean = false;
  public isMoreClicked: boolean = false;
  @Input() userData: IUserData = {
    id:0,
    username: '',
    avatar: '',
    wins: 0,
    losses: 0,
    draws: 0,
    rating: 0,
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.isOwnProfile = params['username'] === this.authService.getLoggedInUser();
    });
  }

  onMoreClick(){
    this.isMoreClicked = !this.isMoreClicked;
  }
  
  onClickedOutside(): void {
    this.isMoreClicked = false
  }
  
}
