import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { LeftBarRoutingModule } from './left-bar/left-bar-routing.module';
import { TopBarRoutingModule } from './top-bar/top-bar-routing.module';



@NgModule({
  declarations: [
    LeftBarComponent,
    TopBarComponent
  ],
  imports: [
    CommonModule,
    LeftBarRoutingModule,
    TopBarRoutingModule
  ],
  exports: [ 
    LeftBarComponent,
    TopBarComponent
   ]
})
export class MenuBarModule { }
