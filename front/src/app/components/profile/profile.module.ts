import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { MenuBarModule } from '../common/menu-bar.module';
import { ProfileStatsComponent } from './profile-stats/profile-stats.component';
import { ProfileIdComponent } from './profile-id/profile-id.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { MoreOptsComponent } from './more-opts/more-opts.component';
import { SharedModule } from 'src/app/utils/shared/shared.module';
import { PipesModule } from 'src/app/utils/pipes/pipes.module';
import { ChatRoutingModule } from '../chat/chat-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileStatsComponent,
    ProfileIdComponent,
    MatchHistoryComponent,
    AchievementsComponent,
    MoreOptsComponent,
  ],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NavBarModule,
    MenuBarModule,
    SharedModule,
    PipesModule,
    ChatRoutingModule,
  ]
})
export class ProfileModule { }
