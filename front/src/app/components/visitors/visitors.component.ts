import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.css']
})
export class VisitorsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  login() {
    this.router.navigateByUrl('/home')
  }

}
