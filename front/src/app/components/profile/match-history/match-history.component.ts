import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service'; 
import { IHistory } from 'src/app/utils/interfaces/history.interface';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
  }
  public matchs : IHistory[] = [];

  private subscriptions: Subscription[] = [];

  @Input() userData: IUserData = {
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
   
  }

  ngOnChanges(changes :any): void {
    if (changes.userData && changes.userData.currentValue && this.userData.id) {
      const subscription = this.userService.getMatchHistory(this.userData.id).subscribe({
        next: (response :IHistory[]) => {
        
          this.matchs = response;
        },
        error: error => {
        }
      });
      this.subscriptions.push(subscription);
    }
        
  }

  ngOnDestroy(): void {
    
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
