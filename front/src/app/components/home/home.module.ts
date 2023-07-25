import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { OnlineModule } from '../right-bar/online/online.module';
import { MenuBarModule} from '../common/menu-bar.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NavBarModule,
    MenuBarModule,
    OnlineModule
  ]
})
export class HomeModule { }
