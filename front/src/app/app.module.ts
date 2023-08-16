import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './components/game/game.module';
import { HomeModule } from './components/home/home.module';
import { NavBarModule } from './components/nav-bar/nav-bar.module';
import { VisitorsModule } from './components/visitors/visitors.module'
import { ChatModule } from './components/chat/chat.module';
import { OnlineModule } from './components/right-bar/online/online.module';
import { MapsModule } from './components/right-bar/maps/maps.module';
import { FriendsModule } from './components/friends/friends.module';
import { LeaderboardModule } from './components/leaderboard/leaderboard.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from './components/profile/profile.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ModalsModule } from './components/modals/modals.module';
import { SettingsModule } from './components/settings/settings.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './components/not-found/not-found.component';



const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    GameModule,
    HomeModule,
    ProfileModule,
    NavBarModule,
    VisitorsModule,
    ChatModule,
    OnlineModule,
    MapsModule,
    FriendsModule,
    LeaderboardModule,
    ModalsModule,
    SettingsModule,


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
