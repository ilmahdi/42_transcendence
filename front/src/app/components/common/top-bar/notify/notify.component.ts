import { Component, Input } from '@angular/core';
import { INotifyData, NotificationType } from 'src/app/utils/interfaces/notify-data.interface';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent {

  @Input() notifyData: INotifyData[] = [];
  NotificationType = NotificationType;


}
