import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { TwoFAComponent } from './two-fa/two-fa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
import { CustomizeGameComponent } from './customize-game/customize-game.component';
import { GameInviteComponent } from './game-invite/game-invite.component';
import { AlertComponent } from './alert/alert.component';


@NgModule({
  declarations: [ ConfirmComponent, TwoFAComponent, CustomizeGameComponent, GameInviteComponent, AlertComponent, MessageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule, 
  ]
})
export class ModalsModule { }
