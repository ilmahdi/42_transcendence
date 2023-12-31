import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  constructor(
    private userService: UserService,
  ) { 
  }

  public usersList: IUserDataShort[] = [];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.getAllUsers();
  }


  getAllUsers() {
    const subscription = this.userService.getAllUsers().subscribe({
     next: (response :IUserDataShort[]) => {
      
       this.usersList = response;
     },
     error: error => {
       console.error('Error:', error.error.message); 
     }
    });
    this.subscriptions.push(subscription);
  }



  ngOnDestroy(): void {
    
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
