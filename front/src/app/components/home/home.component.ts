import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUserData } from '../../utils/interfaces/user-data.interface';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    public loadingService: LoadingService,
  ) { 

  }
  public isLoading: boolean = true;
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

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.getUserData()
  }
  getUserData() {
     this.userService.getUserData().subscribe((data: IUserData) => {
       this.userData = data;
       
       this.loadingService.hideLoading();

    });

  }

}
