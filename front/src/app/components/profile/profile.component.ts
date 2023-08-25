import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    ) { }

  ngOnInit(): void {
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

  toggleActive() {
    this.isClicked = !this.isClicked;
  }
  getUserData() {
    this.route.params.subscribe(params => {

      this.userService.getUserDataByUsername(params['username']).subscribe((data: IUserData) => {
        this.userData = data;
     });
    });
  }

}
