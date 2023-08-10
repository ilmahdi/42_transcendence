import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { OnlineModule } from '../right-bar/online/online.module';
import { MenuBarModule } from '../common/menu-bar.module';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { ProfileIdComponent } from './profile-id/profile-id.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { PositiveNumberPipe } from 'src/app/utils/pipes/positive-number-pipe';
import { AchievementsComponent } from './achievements/achievements.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileStatsComponent,
    ProfileIdComponent,
    MatchHistoryComponent,
    PositiveNumberPipe,
    AchievementsComponent,
  ],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NavBarModule,
    OnlineModule,
    MenuBarModule,
  ]
})
export class ProfileModule { }
