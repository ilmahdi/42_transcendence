import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-id',
  templateUrl: './profile-id.component.html',
  styleUrls: ['./profile-id.component.css']
})
export class ProfileIdComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  public isOwnProfile: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.isOwnProfile = params['username'] === this.authService.getLoggedInUser();
    });
  }
  userData : any = {
    avatar : "./assets/imgs/cover.png",
    username:"ilmahdi",

  }
}
