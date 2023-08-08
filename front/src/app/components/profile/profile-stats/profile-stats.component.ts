import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.css']
})
export class ProfileStatsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  userData : any = {
    username:"ilmahdi",
    wins: 10,
    losses: 3,
    draws:  0,
    rating: 1000,

  }

}
