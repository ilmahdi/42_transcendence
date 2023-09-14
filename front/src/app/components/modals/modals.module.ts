import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { TwoFAComponent } from './two-fa/two-fa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomizeGameComponent } from './customize-game/customize-game.component';


@NgModule({
  declarations: [ ConfirmComponent, TwoFAComponent, CustomizeGameComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class ModalsModule { }
