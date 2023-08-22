import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date): string {
    const now = new Date();
    const diff = new Date(now).getTime() - new Date(value).getTime();

    if (diff < 60000) {
      return Math.floor(diff / 1000) + 's ago';
    } else if (diff < 3600000) {
      return Math.floor(diff / 60000) + 'm ago';
    } else if (diff < 86400000) {
      return Math.floor(diff / 3600000) + 'h ago';
    } else if (diff < 2592000000) {
      return Math.floor(diff / 86400000) + 'd ago';
    } else if (diff < 31536000000) {
      return Math.floor(diff / 2592000000) + 'mo ago';
    } else {
      return Math.floor(diff / 31536000000) + 'y ago';
    }
  }
}