import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { DirectComponent } from './direct/direct.component';
import { RoomsComponent } from './rooms/rooms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ChatService } from 'src/app/services/chat.service';
import { CreatingRoomsComponent } from './creating-rooms/creating-rooms.component';
import { OtherRoomsComponent } from './other-rooms/other-rooms.component';
import { RoomOptionsComponent } from './room-options/room-options.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { MenuBarModule } from '../common/menu-bar.module';

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}}

@NgModule({
  declarations: [
    ChatComponent,
    ConversationsComponent,
    ConversationsComponent,
    DirectComponent,
    RoomsComponent,
    CreatingRoomsComponent,
    OtherRoomsComponent,
    RoomOptionsComponent,
    AddMemberComponent,
  ],
  exports: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MenuBarModule,
    FormsModule, 
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ]
})
export class ChatModule { }
