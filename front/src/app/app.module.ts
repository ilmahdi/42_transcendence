import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './components/game/game.module';
import { HomeModule } from './components/home/home.module';
import { LoginModule } from './components/login/login.module';
import { NavBarModule } from './components/nav-bar/nav-bar.module';
import { VisitorsModule } from './components/visitors/visitors.module'
import { ChatModule } from './components/chat/chat.module';
import { OnlineModule } from './components/right-bar/online/online.module';
import { MapsModule } from './components/right-bar/maps/maps.module';
import { FriendsModule } from './components/friends/friends.module';
import { LeaderboardModule } from './components/leaderboard/leaderboard.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { MenuBarModule} from './components/common/menu-bar.module';
import { TopBarComponent } from './components/common/top-bar/top-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from './components/profile/profile.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';


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
    ProfileModule,
    LoginModule,
    NavBarModule,
    VisitorsModule,
    ChatModule,
    OnlineModule,
    MapsModule,
    FriendsModule,
    LeaderboardModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
