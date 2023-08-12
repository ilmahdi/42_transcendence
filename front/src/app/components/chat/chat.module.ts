import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { ConversationsComponent } from './conversations/conversations.component';
import { DirectComponent } from './direct/direct.component';
import { RoomsComponent } from './rooms/rooms.component';
import { OnlineModule } from '../right-bar/online/online.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ChatService } from 'src/app/services/chat.service';

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}}

@NgModule({
  declarations: [
    ChatComponent,
    ConversationsComponent,
    ConversationsComponent,
    DirectComponent,
    RoomsComponent
  ],
  exports: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NavBarModule,
    OnlineModule,
    FormsModule, ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ]
})
export class ChatModule { }
