import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserData } from '../utils/interfaces/user-data.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private authService: UserService,
  ) { 

  }
  public userData: UserData = { 
    username: '',
    avatar: '',
    wins: 0,
    losses: 0,
    draws: 0,
    rating: 0,
    dummy: 0,

  };
  // public person1: Person = { name: 'John', age: 30, occupation: 'Engineer' }; // Error: 'occupation' does not exist in type 'Person'

  ngOnInit(): void {
    this.getUserData()
  }
  getUserData() {
     this.authService.getUserData().subscribe((data: UserData) => {
       this.userData = data;
       console.log(this.userData);
    });

  }

}
