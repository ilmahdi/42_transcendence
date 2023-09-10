import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/guards/auth.guard';

const routes: Routes = [
  {path: "", loadChildren:()=>import("./components/visitors/visitors.module").then(m=>m.VisitorsModule)},
  {path: "home", loadChildren:()=>import("./components/home/home/home.module").then(m=>m.HomeModule), canLoad: [AuthGuard]},
  {path: "profile", loadChildren:()=>import("./components/profile/profile.module").then(m=>m.ProfileModule), canLoad: [AuthGuard]},
  {path: "game", loadChildren:()=>import("./components/game/game/game.module").then(m=>m.GameModule), canLoad: [AuthGuard]},
  {path: "login", loadChildren:()=>import("./components/login/login.module").then(m=>m.LoginModule)},
  {path: "chat", loadChildren:()=>import("./components/chat/chat.module").then(m=>m.ChatModule), canLoad: [AuthGuard]},
  {path: "friends", loadChildren:()=>import("./components/friends/friends.module").then(m=>m.FriendsModule), canLoad: [AuthGuard]},
  {path: "leaderboard", loadChildren:()=>import("./components/leaderboard/leaderboard.module").then(m=>m.LeaderboardModule), canLoad: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
