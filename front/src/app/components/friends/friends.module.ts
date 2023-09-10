import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsComponent } from './friends.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { MenuBarModule } from '../common/menu-bar.module';


@NgModule({
  declarations: [
    FriendsComponent
  ],
  exports: [FriendsComponent],
  imports: [
    CommonModule,
    FriendsRoutingModule,
    NavBarModule,
    MenuBarModule,
  ]
})
export class FriendsModule { }
