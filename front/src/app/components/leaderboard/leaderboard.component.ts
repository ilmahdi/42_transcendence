import { Component,  OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  constructor() { 
    
  }
  private timout :any

  ngOnInit(): void {
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
