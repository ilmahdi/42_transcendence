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
      avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username : "ossama",
      result : "win",
      date : "01/02/2023",
      duration : "00min/10s",
    },
    {
      avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username : "ossama",
      result : "win",
      date : "01/02/2023",
      duration : "00min/10s",
    },
    {
      avatar : "https://cdn.intra.42.fr/users/0f4ab189b6f733fe558dea7254f1212a/eabdelha.jpg",
      username : "ossama",
      result : "win",
      date : "01/02/2023",
      duration : "00min/10s",
    },
  ]
}
