import { Component, Input, OnInit } from '@angular/core';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.css']
})
export class ProfileStatsComponent implements OnInit {

  constructor() { }

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
  }

  // userData : any = {
  //   username:"ilmahdi",
  //   wins: 10,
  //   losses: 3,
  //   draws:  0,
  //   rating: 1000,

  // }

}