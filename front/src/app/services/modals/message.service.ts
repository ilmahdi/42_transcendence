import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { AuthService } from '../auth.service';
import { ChatService } from '../chat.service';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private componentRef!: ComponentRef<any>;
  private componentSubscriber!: Subject<string>;
  public loggedInUserId? :number;
  
  constructor(private authService: AuthService,
    private chatService:ChatService
    ) {
    this.loggedInUserId  = this.authService.getLoggedInUserId();
  }

  open(
    entry: ViewContainerRef,
    modalComponent: Type<any>, // Pass the component type as an argument
    modalTitle?: string,
    modalBody?: string,
    receiver?:IUserData
  ) {
    this.componentRef = entry.createComponent(modalComponent); // Use the passed component type
    if (modalTitle)
      this.componentRef.instance.title = modalTitle;
    if (modalBody)
      this.componentRef.instance.body = modalBody;
    this.componentRef.instance.closeMeEvent.subscribe(() => this.close());
    this.componentRef.instance.confirmEvent.subscribe((data:string) => {
      const message:Message = {senderId:this.loggedInUserId, receiverId:receiver?.id, message:data, roomId:-1, date:new Date()}
      this.chatService.sendNewMessage(message, receiver)
      console.log(message);
      
      this.send()
    });
    this.componentSubscriber = new Subject<string>();
    return this.componentSubscriber.asObservable();
  }

  close() {
    this.componentSubscriber.complete();
    this.componentRef.destroy();
  }

  send() {
    this.componentSubscriber.next('send');
    this.close();
  }
}
