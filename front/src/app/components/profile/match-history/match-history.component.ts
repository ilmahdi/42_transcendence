import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.css']
})
export class MatchHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public matchs = [
    {
      avatar1 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username1 : "imahdi",
      score1: +9,
      rating1: 1245,
      avatar2 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username2 : "ossama",
      score2: -8,
      rating2: 1322,
      date : new Date(),
      duration : "00min 10s",
    },
    {
      avatar1 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username1 : "imahdi",
      score1: +9,
      rating1: 1245,
      avatar2 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username2 : "ossama",
      score2: -8,
      rating2: 1322,
      date : new Date(),
      duration : "00min 10s",
    },
    {
      avatar1 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username1 : "imahdi",
      score1: +9,
      rating1: 1245,
      avatar2 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username2 : "ossama",
      score2: -8,
      rating2: 1322,
      date : new Date(),
      duration : "00min 10s",
    },
    {
      avatar1 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username1 : "imahdi",
      score1: +9,
      rating1: 1245,
      avatar2 : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username2 : "ossama",
      score2: -8,
      rating2: 1322,
      date : new Date(),
      duration : "00min 10s",
    },
  ]
}
