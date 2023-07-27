import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('ldSecTable', { static: true }) ldSecTable!: ElementRef;

  private scrollTimeout: any;

  startScroll(event: any) {
    if (event.touches.length > 1)
      clearInterval(this.scrollTimeout);

      const container = this.ldSecTable.nativeElement as HTMLElement;
      container.style.overflowY='scroll';
  }

  stopScroll() {
    // clearTimeout(this.scrollTimeout);
    // this.scrollTimeout = setTimeout(() => {
      const container = this.ldSecTable.nativeElement as HTMLElement;
      container.style.overflowY='hidden';
    // }, 200); 
  }

  users:any[] = [
    {
      name: 'ossama',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'anass',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
    {
      name: 'omar',
      avatar: "https://img-new.cgtrader.com/items/4504436/2ae8a812ff/large/ping-pong-player-avatar-3d-icon-3d-model-2ae8a812ff.jpg",
      rating: 1245,
    },
      
    ]

}
