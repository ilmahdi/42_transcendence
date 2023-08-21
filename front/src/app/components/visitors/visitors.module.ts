import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorsRoutingModule } from './visitors-routing.module';
import { VisitorsComponent } from './visitors.component';
import { FirstLoginComponent } from './first-login/first-login.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VisitorsComponent,
    FirstLoginComponent
  ],
  imports: [
    CommonModule,
    VisitorsRoutingModule,
    ReactiveFormsModule,
  ]
})
export class VisitorsModule { }
