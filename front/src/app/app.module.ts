import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameModule } from './components/game/game.module';
import { HomeModule } from './components/home/home.module';
import { NavBarModule } from './components/nav-bar/nav-bar.module';
import { VisitorsModule } from './components/visitors/visitors.module'
import { ChatModule } from './components/chat/chat.module';
import { FriendsModule } from './components/friends/friends.module';
import { LeaderboardModule } from './components/leaderboard/leaderboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileModule } from './components/profile/profile.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ModalsModule } from './components/modals/modals.module';
import { SettingsModule } from './components/settings/settings.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SocketModule } from './utils/socket/socket.module';
import { MenuBarModule } from './components/common/menu-bar.module';
import { HttpErrorInterceptor } from './utils/interceptors/http-error.interceptor';


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
    VisitorsModule,
    ChatModule,
    FriendsModule,
    LeaderboardModule,
    ModalsModule,
    SettingsModule,
    SocketModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
      }
    }),
    MenuBarModule,
  ],
  providers: [
    {

      provide: HTTP_INTERCEPTORS,

      useClass: HttpErrorInterceptor,

      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
