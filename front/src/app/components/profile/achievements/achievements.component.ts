import { Component, Input, OnInit } from '@angular/core';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {

  constructor() { }

  public acCount :number = 0;

  @Input() userData: IUserData = {
    id:0,
    username: '',
    avatar: '',
    wins: 0,
    losses: 0,
    draws: 0,
    games: 0,
    rating: 0,
    win_streak: 0,
    friends_count: 0,

  };


  ngOnChanges(changes :any): void {
    this.acCount = 0;
    if (changes.userData && changes.userData.currentValue && this.userData.id) {
      if (this.isUncovered(this.userData.games, 0))
        ++this.acCount;
      if (this.isUncovered(this.userData.games, 8))
        ++this.acCount;
      if (this.isUncovered(this.userData.games, 98))
        ++this.acCount;
      if (this.isUncovered(this.userData.games, 998))
        ++this.acCount;
      if (this.isUncovered(this.userData.win_streak!, 2))
        ++this.acCount;
      if (this.isUncovered(this.userData.win_streak!, 6))
        ++this.acCount;
      if (this.isUncovered(this.userData.win_streak!, 20))
        ++this.acCount;
      if (this.isUncovered(this.userData.rating, 999))
        ++this.acCount;
      if (this.isUncovered(this.userData.rating, 1999))
        ++this.acCount;
      if (this.isUncovered(this.userData.rating, 2999))
        ++this.acCount;
      if (this.isUncovered(this.userData.friends_count!, 41))
        ++this.acCount;
      if (this.isUncovered(this.userData.friends_count!, 1336))
        ++this.acCount;
    }
        
  }

  ngOnInit(): void {
    
  }

   isUncovered(value: number, threshold: number): boolean {
    if (value > threshold) {
      return true;
    }
    return false;
  }

}
