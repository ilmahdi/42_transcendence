import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftBarComponent } from './left-bar/left-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { LeftBarRoutingModule } from './left-bar/left-bar-routing.module';
import { TopBarRoutingModule } from './top-bar/top-bar-routing.module';
import { LeftBarSecondComponent } from './left-bar-second/left-bar-second.component';
import { LeftBarSecondRoutingModule } from './left-bar-second/left-bar-second-routing.module';



@NgModule({
  declarations: [
    LeftBarComponent,
    LeftBarSecondComponent,
    TopBarComponent,
  ],
  imports: [
    CommonModule,
    LeftBarRoutingModule,
    LeftBarSecondRoutingModule,
    TopBarRoutingModule
  ],
  exports: [ 
    LeftBarComponent,
    LeftBarSecondComponent,
    TopBarComponent
   ]
})
export class MenuBarModule { 
 }
