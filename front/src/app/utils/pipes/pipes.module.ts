import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelativeTimePipe } from './relative-time.pipe';
import { PositiveNumberPipeSign } from './positive-number-sign.pipe';




@NgModule({
  declarations: [
    RelativeTimePipe,
    PositiveNumberPipeSign,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RelativeTimePipe,
    PositiveNumberPipeSign,
  ]
})
export class PipesModule { 
}

