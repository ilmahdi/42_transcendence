import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { OwnedComponent } from './owned/owned.component';
import { VisitedComponent } from './visited/visited.component';
import { MapsModule } from '../right-bar/maps/maps.module';
import { OnlineModule } from '../right-bar/online/online.module';


@NgModule({
  declarations: [
    ProfileComponent,
    OwnedComponent,
    VisitedComponent
  ],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NavBarModule,
    OnlineModule
  ]
})
export class ProfileModule { }
