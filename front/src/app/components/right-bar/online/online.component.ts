import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  users:any[] = [{name: 'oussama'},
      {name: 'omar'},
      {name: 'anas'},
      {name: 'mohammed'},
      {name: 'ali'},
      {name: 'saad'}
    ]
  
  username?:string
  constructor(private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.username.pipe(take(1)).subscribe((username?:string) => {
      this.username = username
    })
  }

}
