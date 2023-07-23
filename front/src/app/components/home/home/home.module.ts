import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../home.component';
import { NavBarModule } from '../../nav-bar/nav-bar.module';
import { OnlineModule } from '../../right-bar/online/online.module';
import { LeftBarModule } from '../../left-bar/left-bar.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NavBarModule,
    LeftBarModule,
    OnlineModule
  ]
})
export class HomeModule { }
