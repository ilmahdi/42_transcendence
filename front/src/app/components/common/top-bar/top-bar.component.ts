import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MenuBarService } from '../menu-bar.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  animations: [
    // to fix later
    trigger('sidebarSlide', [
      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(-100%)' })),
      transition('open <=> closed', animate('9s ease')),
    ]),
  ],
  
})
export class TopBarComponent implements OnInit {

  ngOnInit(): void {
  }
  constructor(
    public menuBarService: MenuBarService,
    private elementRef: ElementRef,
    ) {
    }
    isSidebarOpen: boolean = false;


  toggleLeftBar() {
    this.menuBarService.iShowLeftBar = !this.menuBarService.iShowLeftBar;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuBarService.iShowLeftBar = false;
    }
  }
}
