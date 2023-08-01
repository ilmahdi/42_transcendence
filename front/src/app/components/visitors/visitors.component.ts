import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    ) { }

    private apiUrlAuth = environment.apiUrlAuth;

  ngOnInit(): void {
    // this.apiService.getHelloFromBackend().subscribe((data: any) => {
    //   console.log(data);
    // });
  }

  redirectToLogin() {
    window.location.href = this.apiUrlAuth;
  }

}
