import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { TwoFAComponent } from './two-fa/two-fa.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ ConfirmComponent, TwoFAComponent,],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class ModalsModule { }
