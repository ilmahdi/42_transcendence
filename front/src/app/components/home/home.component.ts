import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUserData } from '../../utils/interfaces/user-data.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
  ) { 

  }
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
    this.getUserData()
  }
  getUserData() {
     this.userService.getUserData().subscribe((data: IUserData) => {
       this.userData = data;
      //  console.log(this.userData);
    });

  }

}
