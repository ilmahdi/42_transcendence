import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './components/game/game/game.module';
import { HomeModule } from './components/home/home/home.module';
import { LoginModule } from './components/login/login.module';
import { NavBarModule } from './components/nav-bar/nav-bar.module';
import { VisitorsModule } from './components/visitors/visitors.module'
import { ChatModule } from './components/chat/chat.module';
import { OnlineModule } from './components/right-bar/online/online.module';
import { MapsModule } from './components/right-bar/maps/maps.module';
import { FriendsModule } from './components/friends/friends.module';
import { LeaderboardModule } from './components/leaderboard/leaderboard.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { LeftBarModule } from './components/left-bar/left-bar.module';

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}}

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
    LeftBarModule,
    VisitorsModule,
    ChatModule,
    OnlineModule,
    MapsModule,
    FriendsModule,
    LeaderboardModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
