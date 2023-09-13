import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { MenuBarModule } from '../common/menu-bar.module';
import { PaddleComponent } from './paddle/paddle.component';
import { BallComponent } from './ball/ball.component';
import { BoardComponent } from './board/board.component';


@NgModule({
  declarations: [
    GameComponent,
    PaddleComponent,
    BallComponent,
    BoardComponent
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
