import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineRoutingModule } from './online-routing.module';
import { OnlineComponent } from './online.component';


@NgModule({
  declarations: [
    OnlineComponent
  ],
  exports: [OnlineComponent],
  imports: [
    CommonModule,
    OnlineRoutingModule
  ]
})
export class OnlineModule { }
