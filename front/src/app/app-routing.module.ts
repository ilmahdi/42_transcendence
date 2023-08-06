import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthGuardReversed } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
    import('./components/visitors/visitors.module').then((m) => m.VisitorsModule),
    canActivate: [AuthGuardReversed],
  },
  {
    path: 'home',
    loadChildren: () =>
    import('./components/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
    import('./components/profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'game',
    loadChildren: () =>
    import('./components/game/game.module').then((m) => m.GameModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    loadChildren: () =>
    import('./components/chat/chat.module').then((m) => m.ChatModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'friends',
    loadChildren: () =>
    import('./components/friends/friends.module').then((m) => m.FriendsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'leaderboard',
    loadChildren: () =>
    import('./components/leaderboard/leaderboard.module').then((m) => m.LeaderboardModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
