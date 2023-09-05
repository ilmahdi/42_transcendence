import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './leaderboard.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { MenuBarModule } from '../common/menu-bar.module';


@NgModule({
  declarations: [
    LeaderboardComponent
  ],
  exports: [LeaderboardComponent],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    NavBarModule,
    MenuBarModule,
  ]
})
export class LeaderboardModule { }
