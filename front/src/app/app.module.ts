import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './components/game/game/game.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeModule } from './components/home/home/home.module';
import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { NavBarModule } from './components/nav-bar/nav-bar.module';
import { VisitorsComponent } from './components/visitors/visitors.component';
import { VisitorsModule } from './components/visitors/visitors.module'
import { ChatComponent } from './components/chat/chat.component';
import { ChatModule } from './components/chat/chat.module';
import { ProfileComponent } from './components/profile/profile.component';
import { OnlineComponent } from './components/right-bar/online/online.component';
import { MapsComponent } from './components/right-bar/maps/maps.component';
import { OnlineModule } from './components/right-bar/online/online.module';
import { MapsModule } from './components/right-bar/maps/maps.module';
import { FriendsComponent } from './components/friends/friends.component';
import { FriendsModule } from './components/friends/friends.module';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LeaderboardModule } from './components/leaderboard/leaderboard.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GameModule,
    HomeModule,
    LoginModule,
    NavBarModule,
    VisitorsModule,
    ChatModule,
    OnlineModule,
    MapsModule,
    FriendsModule,
    LeaderboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
