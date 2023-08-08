import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-id',
  templateUrl: './profile-id.component.html',
  styleUrls: ['./profile-id.component.css']
})
export class ProfileIdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  userData : any = {
    avatar : "./assets/imgs/cover.png",
    username:"ilmahdi",
    wins: 10,
    losses: 3,
    draws:  0,
    rating: 1000,

  }
}
