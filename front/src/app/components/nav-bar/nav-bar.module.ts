import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { NavBarComponent } from './nav-bar.component';


@NgModule({
  declarations: [
    NavBarComponent
  ],
  exports: [NavBarComponent],
  imports: [
    CommonModule,
    NavBarRoutingModule
  ]
})
export class NavBarModule { }
