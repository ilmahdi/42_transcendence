import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { MenuBarModule } from '../common/menu-bar.module';


@NgModule({
  declarations: [
    GameComponent
  ],
  exports: [GameComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    NavBarModule,
    MenuBarModule,
  ]
})
export class GameModule { }
