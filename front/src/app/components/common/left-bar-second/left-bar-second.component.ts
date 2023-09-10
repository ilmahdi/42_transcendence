import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MenuBarService } from 'src/app/services/menu-bar.service';



@Component({
  selector: 'app-left-bar-second',
  templateUrl: './left-bar-second.component.html',
  styleUrls: ['./left-bar-second.component.css'],
  
})
export class LeftBarSecondComponent implements OnInit {

  constructor(
    public menuBarService: MenuBarService,
    ) {
    }

  ngOnInit(): void {
  }

  toggleLeftBar() {
    this.menuBarService.iShowLeftBar = false;
  }
}
