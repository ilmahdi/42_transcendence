import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsComponent } from './friends.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { OnlineModule } from '../right-bar/online/online.module';


@NgModule({
  declarations: [
    FriendsComponent
  ],
  exports: [FriendsComponent],
  imports: [
    CommonModule,
    FriendsRoutingModule,
    NavBarModule,
    OnlineModule
  ]
})
export class FriendsModule { }
