import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private componentRef!: ComponentRef<any>;
  private componentSubscriber!: Subject<string>;

  constructor() {}

  open(
    entry: ViewContainerRef,
    modalComponent: Type<any>, // Pass the component type as an argument
    modalTitle?: string,
    modalBody?: string
  ) {
    this.componentRef = entry.createComponent(modalComponent); // Use the passed component type
    if (modalTitle)
      this.componentRef.instance.title = modalTitle;
    if (modalBody)
      this.componentRef.instance.body = modalBody;
    this.componentRef.instance.closeMeEvent.subscribe(() => this.close());
    this.componentRef.instance.confirmEvent.subscribe((response = "confirm") => this.confirm(response));
    this.componentSubscriber = new Subject<string>();
    return this.componentSubscriber.asObservable();
  }

  close() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  confirm(response: any) {
    this.componentSubscriber.next(response);
    this.close();
  }
}