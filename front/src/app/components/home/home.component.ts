import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JWT_TOKEN } from '../utils/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    
  }

  fetchData (accessToken :string) {
     this.authService.getUserHomeData().subscribe((data: any) => {
      console.log(data);
    });

  }
  
  user :any = {
    name: "ilmahdi",
    wins: 10,
    losses: 3,
    draws: 0,
    games: 13,
    rating: 1245,
    imgUrl: "data:image/jpeg;base64,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"
  }
}
