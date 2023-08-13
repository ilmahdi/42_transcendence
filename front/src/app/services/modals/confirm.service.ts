import {
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/modals/confirm/confirm.component';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private componentRef!: ComponentRef<ConfirmComponent>;
  private componentSubscriber!: Subject<string>;
  constructor() {}

  open(entry: ViewContainerRef, modalTitle: string, modalBody: string) {
    this.componentRef = entry.createComponent(ConfirmComponent);
    this.componentRef.instance.title = modalTitle;
    this.componentRef.instance.body = modalBody;
    this.componentRef.instance.closeMeEvent.subscribe(() => this.close());
    this.componentRef.instance.confirmEvent.subscribe(() => this.confirm());
    this.componentSubscriber = new Subject<string>();
    return this.componentSubscriber.asObservable();
  }

  close() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  confirm() {
    this.componentSubscriber.next('confirm');
    this.close();
  }
}
