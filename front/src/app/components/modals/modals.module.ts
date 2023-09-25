import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { TwoFAComponent } from './two-fa/two-fa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [ ConfirmComponent, TwoFAComponent, MessageComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class ModalsModule { }
