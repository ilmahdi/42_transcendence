import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "", loadChildren:()=>import("./components/visitors/visitors.module").then(m=>m.VisitorsModule)},
  {path: "home", loadChildren:()=>import("./components/home/home.module").then(m=>m.HomeModule)},
  {path: "profile", loadChildren:()=>import("./components/profile/profile.module").then(m=>m.ProfileModule)},
  {path: "game", loadChildren:()=>import("./components/game/game.module").then(m=>m.GameModule)},
  {path: "login", loadChildren:()=>import("./components/login/login.module").then(m=>m.LoginModule)},
  {path: "chat", loadChildren:()=>import("./components/chat/chat.module").then(m=>m.ChatModule)},
  {path: "friends", loadChildren:()=>import("./components/friends/friends.module").then(m=>m.FriendsModule)},
  {path: "leaderboard", loadChildren:()=>import("./components/leaderboard/leaderboard.module").then(m=>m.LeaderboardModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
