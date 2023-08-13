import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitorsRoutingModule } from './visitors-routing.module';
import { VisitorsComponent } from './visitors.component';
import { FirstLoginComponent } from './first-login/first-login.component';


@NgModule({
  declarations: [
    VisitorsComponent,
    FirstLoginComponent
  ],
  imports: [
    CommonModule,
    VisitorsRoutingModule
  ]
})
export class VisitorsModule { }
