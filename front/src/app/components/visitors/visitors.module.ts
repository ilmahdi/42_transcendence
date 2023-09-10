import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorsRoutingModule } from './visitors-routing.module';
import { VisitorsComponent } from './visitors.component';
import { FirstLoginComponent } from './first-login/first-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TwoFaLoginComponent } from './two-fa-login/two-fa-login.component';


@NgModule({
  declarations: [
    VisitorsComponent,
    FirstLoginComponent,
    TwoFaLoginComponent
  ],
  imports: [
    CommonModule,
    VisitorsRoutingModule,
    ReactiveFormsModule,
  ]
})
export class VisitorsModule { }
