import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveNumberSign'
})
export class PositiveNumberPipeSign implements PipeTransform {
  transform(value: number): string {
    if (value >= 0) {
      return `+${value}`;
    } else {
      return `${value}`;
    }
  }
}