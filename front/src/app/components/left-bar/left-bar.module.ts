import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftBarComponent } from './left-bar.component';
import { LeftBarRoutingModule } from './left-bar-routing.module';



@NgModule({
  declarations: [
    LeftBarComponent
  ],
  imports: [
    CommonModule,
    LeftBarRoutingModule
  ],
  exports: [ LeftBarComponent ]
})
export class LeftBarModule { }
