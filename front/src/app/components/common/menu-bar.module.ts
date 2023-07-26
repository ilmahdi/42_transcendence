import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { LeftBarRoutingModule } from './left-bar/left-bar-routing.module';
import { TopBarRoutingModule } from './top-bar/top-bar-routing.module';
import { LeftBarSecondComponent } from './left-bar-second/left-bar-second.component';
import { LeftBarSecondRoutingModule } from './left-bar-second/left-bar-second-routing.module';
import { OnlineFriendsComponent } from './right-bar/online-friends/online-friends.component';



@NgModule({
  declarations: [
    LeftBarComponent,
    LeftBarSecondComponent,
    TopBarComponent,
    OnlineFriendsComponent,
  ],
  imports: [
    CommonModule,
    LeftBarRoutingModule,
    LeftBarSecondRoutingModule,
    TopBarRoutingModule
  ],
  exports: [ 
    LeftBarComponent,
    LeftBarSecondComponent,
    TopBarComponent,
    OnlineFriendsComponent,
   ]
})
export class MenuBarModule { 
 }
