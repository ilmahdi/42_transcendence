import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service'; 
import { IHistory } from 'src/app/utils/interfaces/history.interface';

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

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.userService.getMatchHistory(params['username']).subscribe({
      next: (response :IHistory[]) => {
      
        this.matchs = response;
      },
      error: error => {
      }
  });
    });
  }
}
